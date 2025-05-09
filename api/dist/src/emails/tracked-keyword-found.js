import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tailwind, Button, Container, Font, Html, Head, Body, Heading, Text, Hr, Section, Row, Column, Img, Preview, } from "@react-email/components";
// Subreddit icon component
const SubredditIcon = ({ subredditIconUrl }) => {
    return (_jsx("div", { className: "rounded-full size-10 overflow-hidden", children: _jsx(Img, { src: subredditIconUrl, alt: "Subreddit Icon", width: "40", height: "40", className: "size-10 rounded-full bg-orange-500 text-transparent", style: {
                objectFit: "cover",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
            } }) }));
};
const MyPosts = [
    {
        postId: "123",
        subreddit: "indiehackers",
        subredditIconUrl: "https://styles.redditmedia.com/t5_3gjm0/styles/communityIcon_l6l5fyl07eud1.png",
    },
    {
        postId: "fff",
        subreddit: "SaaS",
        subredditIconUrl: "https://styles.redditmedia.com/t5_2qkq6/styles/communityIcon_u7ddkuay2xn21.jpg",
    },
];
export default function EmailTemplate({ posts = MyPosts, keyword = "Simple", }) {
    const previewText = `Found ${posts.length} posts for "${keyword}" keyword`;
    return (_jsxs(Html, { children: [_jsx(Head, { children: _jsx(Font, { fontFamily: "Geist", fallbackFontFamily: "Helvetica", webFont: {
                        url: "https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOMImpna.woff2",
                        format: "woff2",
                    }, fontWeight: 400, fontStyle: "normal" }) }), _jsx(Tailwind, { children: _jsxs(Body, { className: "mx-auto my-auto bg-white px-2 font-sans", children: [_jsx(Preview, { children: previewText }), _jsxs(Container, { className: "mx-auto my-[20px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[16px]", children: [_jsx(Section, { className: "mt-[16px]", children: _jsx(Text, { className: "m-0 text-left font-bold text-[32px] tracking-tight", children: "Redditime" }) }), _jsxs(Heading, { className: "mx-0 my-[20px] p-0 text-left font-normal text-[20px] text-black", children: ["Found ", posts?.length, " ", posts.length === 1 ? "post" : "posts", " for", " ", _jsxs("strong", { children: ["\"", keyword, "\""] }), " keyword"] }), _jsx(Text, { className: "text-[14px] text-gray-600 leading-[24px] text-left mb-[20px]", children: "Here are the latest matches for your keyword search" }), _jsx(Hr, { className: "mx-0 mb-[20px] w-full border border-[#eaeaea] border-solid" }), _jsx(Section, { children: posts.map((post, index) => (_jsxs("div", { children: [_jsxs(Row, { className: "py-3 last:border-0", children: [_jsx(Column, { align: "left", className: "w-10", children: _jsx(SubredditIcon, { subredditIconUrl: post.subredditIconUrl }) }), _jsx(Column, { className: "px-4 text-left", children: _jsxs(Text, { className: "font-medium text-[16px] text-black leading-[24px] m-0", children: ["r/", post.subreddit] }) }), _jsx(Column, { align: "right", children: _jsx(Button, { href: `https://reddit.com/r/${post.subreddit}/comments/${post.postId}`, className: "rounded bg-[#FF4500] px-4 py-2 text-center font-medium  text-[13px] text-white no-underline", children: "View Post" }) })] }, post.postId), index < posts.length - 1 && (_jsx(Hr, { className: "mx-0 my-[12px] w-full border border-[#eaeaea] border-solid" }))] }, post.postId))) })] })] }) })] }));
}
