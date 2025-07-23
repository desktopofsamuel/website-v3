import { NextPage } from "next";
import Layout from "@/components/Layout";
import {
  Grid,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  Box,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import NextLink from "@/components/NextLink";
import CardBase from "@/components/CardBase";

interface Uses {
  title: string;
  description: string;
  url: string;
  icon: React.FC<React.ComponentPropsWithoutRef<"svg">>;
}

function MobbinIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3496_60)">
        <path d="M64 31H48V47H64V31Z" fill="black" />
        <path
          d="M0 46.9999V32.9134L15.9134 17H29.9999V31.0865L14.0865 46.9999H0Z"
          fill="black"
        />
        <path
          d="M24 46.9999V32.9134L39.9134 17H54V31.0865L38.0866 46.9999H24Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_3496_60">
          <rect
            width="64"
            height="30"
            fill="white"
            transform="translate(0 17)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function ArcIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3500_98)">
        <path
          d="M30.908 5.003C34.367 5.1025 37.491 7.133 38.988 10.2752L44.9282 22.7712L45.0237 22.5298C45.2597 21.9069 45.453 21.2688 45.6025 20.6198L45.6855 20.2327C46.6865 15.2277 51.5512 11.9885 56.5655 12.9788C57.7564 13.2167 58.8888 13.6869 59.898 14.3625C60.9072 15.0382 61.7734 15.9061 62.4471 16.9166C63.1208 17.9271 63.5887 19.0604 63.8243 20.2518C64.0599 21.4432 64.0584 22.6694 63.82 23.8603C62.4857 30.5233 59.0462 36.707 54.1127 41.606L53.9565 41.7578L56.039 46.1362C58.456 51.2187 55.9517 57.362 50.689 59.086L50.4515 59.1603L50.2702 59.215C49.465 59.4417 48.6325 59.5572 47.796 59.5583C46.0471 59.5583 44.3341 59.0628 42.8553 58.1291C41.3766 57.1954 40.1927 55.8618 39.441 54.2827L37.8335 50.9033L37.428 51.0037C35.255 51.5172 33.051 51.8018 30.846 51.8455L30.2447 51.8515C28.1227 51.8515 25.9657 51.6047 23.8107 51.1265L23.3857 51.0275L21.8415 54.2743C20.8002 56.4635 18.9406 58.1561 16.6632 58.9873L16.3882 59.0827C15.2021 59.4739 13.949 59.6205 12.7046 59.5138C11.4602 59.407 10.2504 59.0492 9.14822 58.4618C4.75822 56.1283 3.08422 50.6652 5.22622 46.153L7.14372 42.1208L6.97622 41.9582C4.34747 39.365 2.26347 36.4175 0.880971 33.249L0.696721 32.8158L0.670222 32.7455C-1.23253 28.0145 1.05247 22.6293 5.78047 20.715C9.48897 19.2138 13.6 20.2918 16.128 23.1095L16.1755 23.164L22.287 10.3085C23.0115 8.76003 24.1525 7.44365 25.5824 6.50659C27.0123 5.56954 28.6748 5.04876 30.3837 5.0025L30.6425 5L30.908 5.003Z"
          fill="white"
        />
        <path
          d="M21.7795 47.5113L27.2535 35.9943C23.0725 35.1063 18.8657 32.52 16.4865 29.3738L10.7625 41.4075C13.9432 44.1058 17.7622 46.2268 21.7795 47.5113Z"
          fill="#1A007F"
        />
        <path
          d="M44.6237 29.0288C41.8737 32.3996 38.055 34.8996 33.9688 35.8736L39.4255 47.3561C43.4082 46.0111 47.1322 43.8388 50.348 41.0546L44.6237 29.0288Z"
          fill="#4E000A"
        />
        <path
          d="M10.7625 41.4077L7.90048 47.425C6.44348 50.4852 7.53823 54.2525 10.5382 55.8472C13.7192 57.5367 17.633 56.218 19.1675 53.0022L21.7795 47.5112C17.7459 46.2107 14.004 44.1379 10.7625 41.4077Z"
          fill="#1A007F"
        />
        <path
          d="M55.9855 15.8912C55.1761 15.7292 54.3427 15.7281 53.5329 15.8883C52.7231 16.0484 51.9528 16.3664 51.2659 16.8243C50.5791 17.2822 49.9892 17.8709 49.5299 18.5569C49.0706 19.2428 48.751 20.0125 48.5893 20.822C47.9858 23.8395 46.572 26.6495 44.6238 29.0375L50.3393 41.0717C55.615 36.4942 59.5113 30.2617 60.908 23.2875C61.589 19.8737 59.382 16.5635 55.9855 15.8912Z"
          fill="#FF9396"
        />
        <path
          d="M33.9688 35.8735C32.7448 36.1665 31.4948 36.3218 30.2448 36.3218C29.2708 36.3218 28.2623 36.2098 27.2536 35.9943C23.0726 35.1063 18.8658 32.52 16.4866 29.3738C15.8916 28.5893 15.4091 27.7703 15.0728 26.934C13.7711 23.7185 10.1073 22.167 6.89181 23.46C3.67631 24.7618 2.12506 28.4255 3.41781 31.6408C4.89181 35.2958 7.49531 38.6493 10.7626 41.4078C14.0009 44.1377 17.7399 46.2107 21.7708 47.5113C24.5381 48.399 27.4086 48.8905 30.2363 48.8905C33.3741 48.8905 36.4688 48.3473 39.4171 47.356L33.9688 35.8735Z"
          fill="#002DC8"
        />
        <path
          d="M53.3562 47.399L50.3392 41.0545L44.6237 29.0287L44.6152 29.0375C44.6152 29.0375 44.6152 29.0287 44.6237 29.0287L36.3137 11.5462C35.8036 10.4736 35 9.56754 33.9961 8.93289C32.9921 8.29823 31.829 7.96098 30.6412 7.96021C28.2187 7.96021 26.012 9.35671 24.969 11.5465L16.495 29.3737C18.8742 32.52 23.081 35.1062 27.262 35.9942L30.0032 30.2357C30.262 29.6925 31.0377 29.6925 31.2965 30.2357L33.9775 35.8735H33.9947H33.9772L39.4342 47.356L42.1152 52.9937C42.625 54.0684 43.4296 54.976 44.4353 55.611C45.4411 56.2459 46.6066 56.5819 47.796 56.58C48.3565 56.58 48.9167 56.5025 49.4685 56.3472C53.253 55.304 55.046 50.9507 53.3562 47.399Z"
          fill="#FF536A"
        />
      </g>
      <defs>
        <clipPath id="clip0_3500_98">
          <rect
            width="64"
            height="54.75"
            fill="white"
            transform="translate(0 5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function RayacastIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3496_2)">
        <g clip-path="url(#clip1_3496_2)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16 41.3234V48L0 32L3.33714 28.6629L16 41.328V41.3234ZM22.6766 48H16L32 64L35.3371 60.6629L22.6766 48ZM60.6514 35.3417L63.9909 32L31.9909 0L28.6583 3.35086L41.3189 16.0091H33.6686L24.832 7.19086L21.4949 10.528L26.992 16.0229H23.152V40.8594H47.9863V37.0194L53.4834 42.5143L56.8206 39.1771L47.9863 30.3406V22.6903L60.6514 35.3417ZM17.6686 14.3451L14.32 17.6869L17.904 21.2663L21.2434 17.9291L17.6686 14.3451ZM46.0846 42.7611L42.7474 46.1029L46.3269 49.6869L49.6686 46.3451L46.0846 42.7611ZM10.5051 21.5086L7.16343 24.8503L16 33.6869V27.0057L10.5051 21.5086ZM37.0103 48.0137H30.3269L39.1634 56.8503L42.5051 53.5086L37.0103 48.0137Z"
            fill="#FF6363"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3496_2">
          <rect width="64" height="64" fill="white" />
        </clipPath>
        <clipPath id="clip1_3496_2">
          <rect width="64" height="64" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ObsidianIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3496_6)">
        <path
          d="M47.3 59.4323C46.9061 62.3104 44.0734 64.5674 41.2408 63.7797C37.2267 62.689 32.5765 60.9622 28.3957 60.6441L21.9731 60.1593C20.9414 60.0866 19.9717 59.6395 19.2466 58.902L8.18882 47.5717C7.60153 46.9682 7.20943 46.2019 7.06352 45.3725C6.91762 44.5431 7.02465 43.689 7.3707 42.9213C7.3707 42.9213 14.1871 27.9858 14.4599 27.2133C14.7022 26.4407 15.6415 19.6546 16.1867 16.0191C16.3396 15.0538 16.8212 14.171 17.55 13.5198L30.6071 1.82558C31.0373 1.43967 31.5419 1.14576 32.0898 0.961873C32.6377 0.77799 33.2173 0.708019 33.7933 0.756254C34.3692 0.804488 34.9291 0.969911 35.4388 1.24237C35.9485 1.51483 36.3971 1.88857 36.7571 2.34066L47.7543 16.2159C48.3697 17.0083 48.7005 17.9847 48.6935 18.988C48.6935 21.6085 48.9208 27.0161 50.3899 30.5003C51.8478 33.6336 53.657 36.5911 55.7825 39.3161C56.0398 39.6502 56.1917 40.0535 56.2187 40.4745C56.2457 40.8954 56.1466 41.3148 55.934 41.6791C54.9798 43.2999 53.0711 46.4203 50.3899 50.4039C48.6925 53.1431 47.6314 56.2283 47.2847 59.4321H47.3V59.4323Z"
          fill="black"
          fill-opacity="0.3"
        />
        <path
          d="M47.406 58.9474C47.0121 61.8407 44.1796 64.0977 41.3468 63.3252C37.3479 62.2193 32.7126 60.4925 28.5169 60.1744L22.1094 59.6896C21.0752 59.6143 20.1048 59.1615 19.3828 58.4173L8.32511 47.0565C7.73213 46.447 7.33685 45.6727 7.19092 44.8349C7.045 43.9971 7.15522 43.1348 7.50718 42.3606C7.50718 42.3606 14.3386 27.3646 14.5961 26.5769C14.8537 25.8045 15.7778 19.0031 16.323 15.3374C16.4726 14.3667 16.9544 13.4779 17.6863 12.8229L30.7436 1.08351C31.1748 0.698483 31.6801 0.405656 32.2285 0.223012C32.777 0.0403687 33.357 -0.0282369 33.9329 0.0214085C34.5088 0.0710538 35.0685 0.237902 35.5776 0.511708C36.0867 0.785513 36.5345 1.1605 36.8934 1.61363L47.8756 15.5494C48.4888 16.343 48.8193 17.3186 48.8146 18.3215C48.8146 20.9572 49.042 26.3801 50.4961 29.8791C51.953 33.0272 53.762 36 55.8887 38.7406C56.1516 39.0746 56.308 39.4799 56.3377 39.904C56.3674 40.328 56.269 40.7512 56.0552 41.1186C55.0856 42.7546 53.1924 45.875 50.4961 49.8891C48.8049 52.641 47.7492 55.7357 47.406 58.9474Z"
          fill="#6C31E3"
        />
        <path
          d="M20.5643 59.2655C25.6994 48.8592 25.5629 41.3914 23.3666 36.0896C21.3672 31.1819 17.6257 28.0918 14.6871 26.1681C14.6283 26.4504 14.5368 26.7249 14.4144 26.986L7.50717 42.3609C7.15711 43.1365 7.04933 43.9997 7.19795 44.8375C7.34658 45.6754 7.74467 46.4489 8.34014 47.0568L19.3828 58.4173C19.729 58.7612 20.1278 59.0475 20.5643 59.2655Z"
          fill="url(#paint0_radial_3496_6)"
        />
        <path
          d="M34.5304 38.1498C35.9171 38.286 37.2811 38.5964 38.5902 39.0737C42.8011 40.6491 46.6333 44.1937 49.7992 51.0253C50.0265 50.6315 50.2536 50.2527 50.4961 49.8891C52.4308 47.0182 54.2846 44.0936 56.0552 41.1186C56.2711 40.7527 56.3721 40.3303 56.345 39.9063C56.318 39.4823 56.1643 39.0762 55.9037 38.7406C53.7718 36.0008 51.9577 33.028 50.4961 29.8791C49.0418 26.3952 48.8298 20.9573 48.8146 18.3215C48.8146 17.3218 48.4965 16.3372 47.8756 15.5495L36.8934 1.61368L36.7116 1.3866C37.5145 4.0372 37.4692 6.15807 36.9692 8.08173C36.5148 9.8691 35.6666 11.4899 34.7727 13.2017C34.4699 13.7773 34.1668 14.368 33.879 14.9739C32.4545 17.6946 31.638 20.6923 31.4858 23.7596C31.3343 27.4253 32.0764 32.015 34.5154 38.15H34.5304V38.1498Z"
          fill="url(#paint1_radial_3496_6)"
        />
        <path
          d="M34.5154 38.1498C32.0764 32.0151 31.3343 27.4254 31.4858 23.7595C31.6373 20.1242 32.6975 17.3976 33.879 14.9739L34.7879 13.2018C35.6666 11.49 36.4997 9.86915 36.9691 8.08178C37.5268 5.87152 37.4374 3.54754 36.7116 1.38665C35.1432 -0.336727 32.4784 -0.472052 30.7434 1.08361L17.6864 12.823C16.9546 13.478 16.4727 14.3668 16.3232 15.3375L14.7328 25.8801C14.7328 25.9862 14.7024 26.0772 14.6873 26.1832C17.6259 28.0918 21.3522 31.1819 23.3668 36.0746C23.7607 37.0441 24.094 38.059 24.3363 39.1648C27.6464 38.2468 31.0886 37.8985 34.5156 38.1348V38.1498H34.5154Z"
          fill="url(#paint2_radial_3496_6)"
        />
        <path
          d="M41.362 63.3254C44.1795 64.0978 47.0121 61.8408 47.4059 58.9323C47.7285 56.1736 48.5443 53.4954 49.8144 51.0254C46.6333 44.1936 42.801 40.6491 38.6052 39.0738C34.1367 37.4077 29.2743 37.9681 24.3361 39.1648C25.4418 44.1788 24.7904 50.7376 20.5795 59.2656C21.0491 59.5079 21.5792 59.6444 22.1094 59.6897L28.7592 60.1895C32.3642 60.4471 37.7417 62.3102 41.362 63.3252V63.3254Z"
          fill="url(#paint3_radial_3496_6)"
        />
        <path
          d="M31.516 23.5324C31.3495 27.1678 31.8039 31.3184 34.2426 37.4379L33.4852 37.3621C31.2888 30.9851 30.8041 27.7132 30.9707 24.0322C31.1222 20.3515 32.3189 17.5187 33.5004 15.0952C33.8033 14.4893 34.5001 13.3531 34.8032 12.7775C35.6816 11.0659 36.2725 10.1722 36.7723 8.61188C37.4995 6.43068 37.3479 5.4007 37.257 4.37073C37.8175 8.08176 35.6816 11.3082 34.076 14.5953C32.5896 17.3564 31.7116 20.4037 31.501 23.5324H31.516Z"
          fill="url(#paint4_radial_3496_6)"
        />
        <path
          d="M24.0937 36.3472C24.3966 37.0138 24.6541 37.5591 24.8359 38.3921L24.1845 38.5436C23.927 37.5742 23.7302 36.8775 23.3514 36.0443C21.1399 30.8486 17.5952 28.1675 14.7172 26.1984C18.2013 28.0767 21.7913 31.0304 24.0935 36.3472H24.0937Z"
          fill="url(#paint5_radial_3496_6)"
        />
        <path
          d="M24.8662 39.0587C26.078 44.7391 24.7147 51.9643 20.7006 58.993C24.0635 52.025 25.6994 45.3448 24.3361 39.1495L24.8662 39.0435V39.0587Z"
          fill="url(#paint6_radial_3496_6)"
        />
        <path
          d="M38.7415 38.5286C45.3306 40.9976 47.8755 46.4052 49.7689 50.9344C47.421 46.2084 44.1643 40.9824 38.4991 39.0435C34.1971 37.5592 30.5618 37.7408 24.3361 39.1495L24.1998 38.5437C30.8041 37.0289 34.2578 36.8473 38.7415 38.5437V38.5286Z"
          fill="url(#paint7_radial_3496_6)"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(5501.26 52.4623) rotate(-104) scale(2895.07 5421.13)"
        >
          <stop stop-color="white" stop-opacity="0.4" />
          <stop offset="1" stop-opacity="0.1" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6433.45 1349.7) rotate(-82) scale(4736.63 9449.28)"
        >
          <stop stop-color="white" stop-opacity="0.6" />
          <stop offset="1" stop-color="white" stop-opacity="0.1" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(5476.73 2174.93) rotate(-77) scale(4046.65 6999.29)"
        >
          <stop stop-color="white" stop-opacity="0.8" />
          <stop offset="1" stop-color="white" stop-opacity="0.4" />
        </radialGradient>
        <radialGradient
          id="paint3_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(2120.02 4.29209e+06) scale(2692.12 2343.25)"
        >
          <stop stop-color="white" stop-opacity="0.3" />
          <stop offset="1" stop-opacity="0.3" />
        </radialGradient>
        <radialGradient
          id="paint4_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-1516.62 706.266) rotate(102) scale(2106.4 10870.1)"
        >
          <stop stop-color="white" stop-opacity="0" />
          <stop offset="1" stop-color="white" stop-opacity="0.2" />
        </radialGradient>
        <radialGradient
          id="paint5_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-55.0594 -195.683) rotate(45) scale(1553.15 1894.9)"
        >
          <stop stop-color="white" stop-opacity="0.2" />
          <stop offset="1" stop-color="white" stop-opacity="0.4" />
        </radialGradient>
        <radialGradient
          id="paint6_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1087.95 -299.975) rotate(80) scale(1812.9 7875.48)"
        >
          <stop stop-color="white" stop-opacity="0.1" />
          <stop offset="1" stop-color="white" stop-opacity="0.3" />
        </radialGradient>
        <radialGradient
          id="paint7_radial_3496_6"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(2564.44 -7.47504e+06) scale(5211.61 2771.17)"
        >
          <stop stop-color="white" stop-opacity="0.2" />
          <stop offset="0.5" stop-color="white" stop-opacity="0.2" />
          <stop offset="1" stop-color="white" stop-opacity="0.3" />
        </radialGradient>
        <clipPath id="clip0_3496_6">
          <rect
            width="49.3494"
            height="64"
            fill="white"
            transform="translate(7)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function ReadwiseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_3496_44)">
        <g clip-path="url(#clip1_3496_44)">
          <path
            d="M51.9424 51.3066C53.8539 54.4853 55.4112 55.5392 58.5984 55.9189V59.0976H42.88L28.1557 34.5216H24.4779V50.6282C24.4779 54.9418 25.5445 55.5392 30.0757 55.9189V59.0976H6.34454V55.9189C10.8757 55.5392 11.9424 54.9333 11.9424 50.6282V14.6389C11.9424 10.257 11.0165 9.72796 6.34454 9.34822V6.16956H30.7669C45.4912 6.16956 53.184 9.26716 53.184 20.1557C53.184 28.3946 49.1776 32.3285 41.1093 33.6853L51.9424 51.3066Z"
            fill="black"
          />
          <path
            d="M40.2304 11.84C38.9803 14.1354 40.9088 24.9642 40.9088 24.9642C40.9344 25.536 40.5461 26.0394 39.9829 26.1632C39.9829 26.1632 28.1813 26.2144 24.2816 29.457L40.2304 11.84Z"
            fill="#F4F9F9"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3496_44">
          <rect width="64" height="64" fill="white" />
        </clipPath>
        <clipPath id="clip1_3496_44">
          <rect width="64" height="64" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function FigmaIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_3496_21"
        maskUnits="userSpaceOnUse"
        x="10"
        y="0"
        width="43"
        height="64"
      >
        <path d="M52.6666 0H10V64H52.6666V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_3496_21)">
        <path
          d="M20.6666 64.0001C26.5546 64.0001 31.3334 59.2214 31.3334 53.3334V42.6667H20.6666C14.7787 42.6667 10 47.4454 10 53.3334C10 59.2214 14.7787 64.0001 20.6666 64.0001Z"
          fill="#0ACF83"
        />
        <path
          d="M10 31.9999C10 26.1119 14.7787 21.3333 20.6666 21.3333H31.3334V42.6666H20.6666C14.7787 42.6666 10 37.8879 10 31.9999Z"
          fill="#A259FF"
        />
        <path
          d="M10 10.6666C10 4.77866 14.7787 0 20.6666 0H31.3334V21.3334H20.6666C14.7787 21.3334 10 16.5546 10 10.6666Z"
          fill="#F24E1E"
        />
        <path
          d="M31.3334 0H42.0001C47.8881 0 52.6667 4.77866 52.6667 10.6666C52.6667 16.5546 47.8881 21.3334 42.0001 21.3334H31.3334V0Z"
          fill="#FF7262"
        />
        <path
          d="M52.6667 31.9999C52.6667 37.8879 47.8881 42.6666 42.0001 42.6666C36.1121 42.6666 31.3334 37.8879 31.3334 31.9999C31.3334 26.1119 36.1121 21.3333 42.0001 21.3333C47.8881 21.3333 52.6667 26.1119 52.6667 31.9999Z"
          fill="#1ABCFE"
        />
      </g>
    </svg>
  );
}

const uses: Array<Uses> = [
  {
    title: "Mobbin",
    description:
      "I use Mobbin to quickly discover common UI and UX patterns and discover the best design apporach without registering any apps",
    url: "https://mobbin.com/?referrer_workspace_id=4bfd1db9-2fbb-44ca-a4ca-c835b78d9486",
    icon: MobbinIcon,
  },
  {
    title: "Raycast",
    description:
      "I use Raycast everyday with upgraded plan. It is productivity powerhouse that can do clipboard history, window management and best of all AI Chat support.",
    url: "https://www.raycast.com/hey/11fac304",
    icon: RayacastIcon,
  },
  {
    title: "Arc Browser",
    description:
      "I have been daily driving Arc for more than 2 years, it's elegant, fun with new ideas around how we interact with the internet.",
    url: "https://arc.net/gift/76e7ab44",
    icon: ArcIcon,
  },
  {
    title: "Obsidian",
    description:
      "Obsidian now serves as note-taking system for my structured notes.",
    url: "https://obsidian.md/?utm_source=desktopofsamuel",
    icon: ObsidianIcon,
  },
  {
    title: "Readwise",
    description:
      "I am establishing a content digest system with Readwise as the central hub for all content consumption.",
    url: "https://readwise.io/i/samuel8292",
    icon: ReadwiseIcon,
  },
  {
    title: "Figma",
    description:
      "Without a question, Figma is a daily driver for me. It's a totally free & excellent graphic design tools to create banners and social media graphics.",
    url: "https://www.figma.com/?utm_source=desktopofsamuel",
    icon: FigmaIcon,
  },
];

const UsesPage: NextPage = () => {
  return (
    <Layout title="Software and Tools that I daily drive">
      <Heading variant="pagetitle">Uses</Heading>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/uses">Uses</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text>Tools that I love to use everyday</Text>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} pb={{ base: 10, md: 40}}>
        {uses.map((item) => {
          return (
            <NextLink href={item.url} key={item.title} target="_blank" variant="noeffect">
          
            <CardBase title="">
              <Box py="4">
                <item.icon />
              </Box>

              <Text fontSize="lg" fontWeight="bold" fontFamily="heading" mb="0">
                {item.title}
              </Text>
              <Text>{item.description}</Text>
              </CardBase></NextLink>
          );
        })}
      </Grid>
    </Layout>
  );
};

export default UsesPage;
