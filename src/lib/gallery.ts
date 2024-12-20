import { Photo, PhotoMatter } from "@/config/types";
import { sync } from "glob";
import fs from "fs";
import matter from "gray-matter";
import dayjs from "dayjs";
import { baseDomain } from "@/config/const";

const GALLERY_PATH = "src/gallery";
const PHOTO_PATH = "gallery";
const EUROPE_PATH = "europe";
const JAPAN_PATH = "japan";
const UNIVERSAL = [EUROPE_PATH, JAPAN_PATH];

export const getPhotoPath = (category?: string) => {
    const folder = category || "**";
    const photoPaths: string[] = sync(`${GALLERY_PATH}/**/**/*.mdx`);
    return photoPaths;
};

const parsePhoto = async (photoPath: string): Promise<Photo> => {
    const photoDetail = await parsePhotoDetail(photoPath);
    return { ...photoDetail };
};

const parsePhotoDetail = async (photoPath: string) => {
    const file = fs.readFileSync(photoPath, "utf8");
    const { data } = matter(file);
    const grayMatter = data as PhotoMatter;
    const uniqueKey = `${photoPath}-${grayMatter.date}`;
    const dateString = dayjs(grayMatter.date)
        .locale("ko")
        .format("YYYY년 MM월 DD일");

    if (!grayMatter.thumbnail.includes("gallery")) {
        let url = PHOTO_PATH;
        if (photoPath.includes(EUROPE_PATH)) {
            url += `/${EUROPE_PATH}/`;
        } else if (photoPath.includes(JAPAN_PATH)) {
            url += `/${JAPAN_PATH}/`;
        }
        grayMatter.thumbnail = url + grayMatter.thumbnail;
    }
    return { ...grayMatter, uniqueKey, dateString };
};

const sortPhotoList = (PhotoList: Photo[]) => {
    return PhotoList.sort((a, b) => (a.date > b.date ? -1 : 1));
};

// 모든 포스트 목록 조회. 블로그 메인 페이지에서 사용
export const getPhotoList = async (category?: string): Promise<Photo[]> => {
    const photoPaths = getPhotoPath(category);
    const photoList = await Promise.all(
        photoPaths.map((photoPath) => parsePhoto(photoPath))
    );
    return photoList;
};

export const getSortedPhotoList = async (category?: string) => {
    const photoList = await getPhotoList(category);
    return sortPhotoList(photoList);
};

export const getAllPhotoCount = async () => (await getPhotoList()).length;
