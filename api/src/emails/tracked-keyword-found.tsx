import {
  Tailwind,
  Button,
  Container,
  Font,
  Html,
  Head,
  Body,
  Heading,
  Text,
  Hr,
  Section,
  Row,
  Column,
  Img,
  Preview,
} from "@react-email/components";

// Interface for Reddit post data
interface RedditPost {
  postId: string;
  subreddit: string;
  matchedKeyword?: string;
  subredditIconUrl?: string;
}

interface EmailTemplateProps {
  posts?: RedditPost[];
  keyword?: string;
}

// Subreddit icon component
const SubredditIcon = ({ subredditIconUrl }: { subredditIconUrl: string }) => {
  return (
    <div className="rounded-full size-10 overflow-hidden">
      <Img
        src={subredditIconUrl}
        alt="Subreddit Icon"
        width="40"
        height="40"
        className="size-10 rounded-full bg-orange-500 text-transparent"
        style={{
          objectFit: "cover",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

const MyPosts: RedditPost[] = [
  {
    postId: "123",
    subreddit: "indiehackers",
    subredditIconUrl:
      "https://styles.redditmedia.com/t5_3gjm0/styles/communityIcon_l6l5fyl07eud1.png",
  },
  {
    postId: "fff",
    subreddit: "SaaS",
    subredditIconUrl:
      "https://styles.redditmedia.com/t5_2qkq6/styles/communityIcon_u7ddkuay2xn21.jpg",
  },
];

export default function EmailTemplate({
  posts = MyPosts,
  keyword = "Simple",
}: EmailTemplateProps) {
  const previewText = `Found ${posts.length} posts for "${keyword}" keyword`;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Geist"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOMImpna.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[20px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[16px]">
            {/* Header with Logo Text */}
            <Section className="mt-[16px]">
              <Text className="m-0 text-left font-bold text-[32px] tracking-tight">
                Redditime
              </Text>
            </Section>

            {/* Main Heading */}
            <Heading className="mx-0 my-[20px] p-0 text-left font-normal text-[20px] text-black">
              Found {posts?.length} {posts.length === 1 ? "post" : "posts"} for{" "}
              <strong>"{keyword}"</strong> keyword
            </Heading>

            <Text className="text-[14px] text-gray-600 leading-[24px] text-left mb-[20px]">
              Here are the latest matches for your keyword search
            </Text>

            <Hr className="mx-0 mb-[20px] w-full border border-[#eaeaea] border-solid" />

            {/* Posts List */}
            <Section>
              {posts.map((post, index) => (
                <div key={post.postId}>
                  <Row key={post.postId} className="py-3 last:border-0">
                    <Column align="left" className="w-10">
                      <SubredditIcon
                        subredditIconUrl={post.subredditIconUrl as string}
                      />
                    </Column>

                    <Column className="px-4 text-left">
                      <Text className="font-medium text-[16px] text-black leading-[24px] m-0">
                        r/{post.subreddit}
                      </Text>
                    </Column>

                    <Column align="right">
                      <Button
                        href={`https://reddit.com/r/${post.subreddit}/comments/${post.postId}`}
                        className="rounded bg-[#FF4500] px-4 py-2 text-center font-medium  text-[13px] text-white no-underline"
                      >
                        View Post
                      </Button>
                    </Column>
                  </Row>
                  {index < posts.length - 1 && (
                    <Hr className="mx-0 my-[12px] w-full border border-[#eaeaea] border-solid" />
                  )}
                </div>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
