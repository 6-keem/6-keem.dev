import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "off", // 사용되지 않는 변수 관련 경고 끄기
            "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 경고 끄기
            "@typescript-eslint/ban-ts-comment": "off", // ts-ignore 관련 경고 끄기
            "@typescript-eslint/no-empty-object-type": "off", // 빈 객체 타입 관련 경고 끄기
            "@typescript-eslint/no-unused-expressions": "off", // 사용되지 않은 표현식 관련 경고 끄기
            "@next/next/no-img-element": "off", // <img> 요소 관련 경고 끄기
            "react-hooks/exhaustive-deps": "off", // useEffect 의존성 배열 관련 경고 끄기
        },
    },
];

export default eslintConfig;
