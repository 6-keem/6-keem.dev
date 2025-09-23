import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// 디버그: env 확인
console.log('DEBUG: NEXT_PUBLIC_SUPABASE_URL =>', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('DEBUG: SUPABASE_SERVICE_ROLE_KEY =>', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 환경변수가 비어있습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY를 넣으세요.');
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BUCKET = 'image-bucket';

// 랜덤 파일명 생성
function randomFileName(ext: string) {
  return crypto.randomBytes(8).toString('hex') + ext;
}

// MIME 타입
function getMimeType(fileName: string) {
  if (fileName.endsWith('.png')) return 'image/png';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'image/jpeg';
  if (fileName.endsWith('.webp')) return 'image/webp';
  if (fileName.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

// 특정 mdx 파일 import
async function importMdx(filePath: string, category: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const { title, date, desc, thumbnail, tags, seriesName } = data;

  const dateStr = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
  let newContent = content;

  // -----------------------------
  // 이미지 업로드 (MDX 내 일반 이미지)
  // -----------------------------
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const thumbnailRegex = /<Thumbnail\s+src=["'](.*?)["']\s*\/>/g;

  const localImages: string[] = [];
  if (thumbnail) localImages.push(thumbnail);

  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    localImages.push(match[1]);
  }
  while ((match = thumbnailRegex.exec(newContent)) !== null) {
    localImages.push(match[1]);
  }

  for (const localPath of localImages) {
    // public/posts 밑에서 실제 파일 읽기
    const absPath = path.resolve('public', 'posts', localPath.replace(/^\/posts\//, ''));
    if (!fs.existsSync(absPath)) {
      console.warn(`⚠️ 이미지 파일 없음: ${absPath}`);
      continue;
    }

    const ext = path.extname(localPath);
    const randomName = randomFileName(ext);
    const fileName = `${randomName}`; // 카테고리/날짜/랜덤
    const fileBuffer = fs.readFileSync(absPath);

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, fileBuffer, {
      upsert: true,
      contentType: getMimeType(fileName),
    });

    if (error) {
      console.error('❌ 이미지 업로드 실패:', error.message);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // frontmatter thumbnail 업데이트
    if (localPath === thumbnail) data.thumbnail = publicUrl;

    // MDX content 내 치환
    newContent = newContent.replaceAll(localPath, publicUrl);
  }

  // -----------------------------
  // thumbnail frontmatter만 별도 업로드
  // -----------------------------
  let thumbnailUrl: string | null = null;
  if (thumbnail) {
    const absThumbPath = path.resolve('public', 'posts', thumbnail.replace(/^\/posts\//, ''));
    if (fs.existsSync(absThumbPath)) {
      const ext = path.extname(absThumbPath);
      const randomName = randomFileName(ext);
      const fileName = `${randomName}`;
      const fileBuffer = fs.readFileSync(absThumbPath);

      const { error } = await supabase.storage.from(BUCKET).upload(fileName, fileBuffer, {
        upsert: true,
        contentType: getMimeType(fileName),
      });

      if (error) {
        console.error('❌ thumbnail 업로드 실패:', error.message);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }
    } else {
      console.warn(`⚠️ thumbnail 파일 없음: ${absThumbPath}`);
    }
  }

  // -----------------------------
  // 시리즈 처리
  // -----------------------------
  //
  let seriesId: number | null = null;
  if (seriesName) {
    const { data: sid, error: sError } = await supabase.rpc('get_or_create_series', { series_name: seriesName });
    if (sError) {
      console.error('❌ get_or_create_series 실패:', sError.message);
    } else {
      // JSON에서 id만 꺼내기
      seriesId = (sid as any)?.id ?? null;
    }
  }

  // -----------------------------
  // create_post 호출
  // -----------------------------
  console.log('📝 create_post 호출 (title, description, category, date, series_id, content, tag, thumbnail)');
  const { data: newPost, error: pError } = await supabase.rpc('create_post', {
    title,
    description: desc,
    category,
    date: dateStr,
    series_id: seriesId,
    content: newContent,
    tag: tags?.join(',') || '', // text -> function 내부에서 text[]로 변환
    thumbnail: thumbnailUrl, // frontmatter thumbnail 업로드 URL
  });

  if (pError) {
    console.error('❌ create_post 실패:', pError.message);
  } else {
    console.log(`✅ '${title}' import 성공`, newPost);
  }
}

// -----------------------------
// 실행부
// -----------------------------
(async () => {
  const argCategory = process.argv[2] || null;
  const postsRoot = path.resolve(process.cwd(), 'src/posts');

  if (argCategory) {
    const mdxDir = path.join(postsRoot, argCategory);
    if (!fs.existsSync(mdxDir)) {
      console.error(`❌ 카테고리 디렉토리 없음: ${mdxDir}`);
      process.exit(1);
    }
    const files: string[] = [];
    fs.readdirSync(mdxDir).forEach((subDir) => {
      const subPath = path.join(mdxDir, subDir);
      if (fs.statSync(subPath).isDirectory()) {
        fs.readdirSync(subPath).forEach((f) => {
          if (f.endsWith('.mdx')) files.push(path.join(subPath, f));
        });
      }
    });

    console.log(`👉 찾은 mdx 파일 개수: ${files.length}`);
    for (const file of files) {
      console.log(`📄 importMdx 시작: ${file}`);
      await importMdx(file, argCategory);
    }
  } else {
    // 전체 카테고리 처리
    const categories = fs.readdirSync(postsRoot);
    for (const category of categories) {
      const mdxDir = path.join(postsRoot, category);
      if (!fs.statSync(mdxDir).isDirectory()) continue;

      const files: string[] = [];
      fs.readdirSync(mdxDir).forEach((subDir) => {
        const subPath = path.join(mdxDir, subDir);
        if (fs.statSync(subPath).isDirectory()) {
          fs.readdirSync(subPath).forEach((f) => {
            if (f.endsWith('.mdx')) files.push(path.join(subPath, f));
          });
        }
      });

      console.log(`👉 찾은 mdx 파일 개수: ${files.length}`);
      for (const file of files) {
        console.log(`📄 importMdx 시작: ${file}`);
        await importMdx(file, category);
      }
    }
  }

  console.log('🎉 모든 작업 완료');
})();
