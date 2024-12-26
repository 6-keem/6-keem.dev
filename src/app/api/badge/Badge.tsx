import { getPostByDate, getPostList, getSortedPostList } from "@/lib/post";

const svgStyles = `
  @keyframes heartBeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.1); }
    28% { transform: scale(1); }
    42% { transform: scale(1.1); }
    70% { transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInAll { 
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .heart { 
    animation: heartBeat 3s ease-in-out infinite; 
  }
  .tag-group { opacity: 0; }
  .svg-fade-in { 
    animation: fadeInAll 1.5s ease-out forwards; 
  }
`;

export default async function BlogBadge({
    width,
    height,
    date,
}: {
    width: string;
    height: string;
    date?: string | null;
}) {
    let post = await getPostByDate(date);
    let currentX = 22;

    // 태그에 대한 SVG 요소 생성
    const mappedRects = post.tags
        .map((item, index) => {
            const approxCharWidth = 8;
            const horizontalPadding = 4;
            const rectHeight = 22;
            const gapBetweenRects = 4;
            const textWidth = item.length * approxCharWidth;
            const rectWidth = textWidth * 0.8 + 4 * horizontalPadding;

            const rectY = 90;
            const textCenterX = currentX + rectWidth / 2;
            const textCenterY = rectY + rectHeight / 2 + 1;

            const svgFragment = `
        <g class="tag-group" style="animation: fadeIn 0.5s ease-out ${
            index * 0.1
        }s both;">
          <rect
            x="${currentX}"
            y="${rectY}"
            width="${rectWidth}"
            height="${rectHeight}"
            stroke="#a1a1aa"
            stroke-width="0.5"
            fill="none"
            rx="10"
            ry="10"
          />
          <text
            x="${textCenterX}"
            y="${textCenterY}"
            fill="#0ea5e9"
            font-size="12"
            font-weight="bold"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            ${item}
          </text>
        </g>
      `;
            currentX += rectWidth + gapBetweenRects;
            return svgFragment;
        })
        .join("");

    return `
    <svg
      class="svg-fade-in"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>${svgStyles}</style>
      <rect
        x="0.5"
        y="0.5"
        width="${parseInt(width) - 1}"
        height="${parseInt(height) - 1}"
        rx="7.5"
        stroke="#a1a1aa"
      />
      <text
        x="25"
        y="32"
        fill="#8D96A0"
        font-size="12"
        font-weight="bold"
      >
        6-keem-dev
      </text>

      <g transform="translate(${parseInt(width) - 40}, 23) scale(0.9)">
        <g class="heart">
          <path d="M6.46113 2.1128C6.98582 0.869197 8.18444 0.000259986 9.57859 0.000259986C11.4566 0.000259986 12.8092 1.60683 12.9792 3.52151C12.9792 3.52151 13.071 3.9968 12.869 4.85248C12.5939 6.01782 11.9472 7.05316 11.0754 7.84332L6.46113 11.9602L1.92456 7.84306C1.05276 7.05316 0.406129 6.01756 0.131043 4.85222C-0.0709808 3.99654 0.020801 3.52125 0.020801 3.52125C0.190844 1.60657 1.54339 0 3.42141 0C4.81582 0 5.93644 0.869197 6.46113 2.1128Z" fill="#F74731"/>
        </g>
      </g>

      <text
        x="25"
        y="55"
        fill="#8D96A0"
        font-size="14"
        font-weight="bold"
      >
        ${
            post.title.length >= 50
                ? post.title.slice(0, 50) + "..."
                : post.title
        }
      </text>
      <text
        x="25"
        y="78"
        fill="#8D96A0"
        font-size="12"
        font-weight="lighter"
      >
        <tspan>
        ${post.desc.length >= 60 ? post.desc.slice(0, 60) + "..." : post.desc}
        </tspan>
      </text>

      ${mappedRects}
    </svg>
  `;
}
