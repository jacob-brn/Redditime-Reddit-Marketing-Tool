"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RedditLoginButton from "../RedditLoginButton";
import { FaRedditAlien } from "react-icons/fa6";

export default function LogInCard() {
  return (
    <Card className="max-w-lg mx-auto w-full rounded-md border-none shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="border w-min rounded-md mx-auto [box-shadow:0px_0px_12px_-5px_var(--primary)_inset]">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
              className="size-12 mx-auto"
            >
              <g
                transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
                fill="#FF4500"
                stroke="none"
              >
                <path d="M2660 4271 c-179 -37 -258 -261 -141 -400 l29 -35 -19 -44 c-11 -24 -31 -79 -45 -121 -14 -41 -31 -79 -37 -83 -7 -4 -46 -8 -87 -8 -90 0 -278 -31 -398 -65 l-88 -24 -84 80 c-259 248 -614 479 -741 483 -45 1 -54 -2 -74 -27 -32 -41 -64 -147 -96 -322 -17 -93 -17 -448 0 -540 41 -221 82 -340 142 -417 25 -30 28 -40 19 -62 -9 -24 -14 -26 -77 -26 -38 0 -84 -5 -104 -10 -51 -14 -118 -76 -145 -134 -23 -48 -24 -62 -24 -251 0 -172 3 -206 19 -240 44 -97 114 -145 225 -154 l68 -6 23 -91 c96 -379 369 -662 795 -823 187 -71 398 -104 660 -104 218 0 331 14 510 60 30 8 69 18 85 23 17 4 65 22 108 39 270 108 474 268 619 486 49 73 108 209 129 300 12 50 23 96 25 103 2 8 24 12 62 12 71 0 119 18 171 66 71 64 84 106 89 295 3 105 0 186 -8 222 -13 67 -55 127 -118 171 -38 27 -52 31 -136 34 -88 4 -95 6 -100 27 -4 15 5 41 27 78 55 91 105 258 137 458 13 86 13 388 0 465 -22 119 -31 170 -39 199 -24 88 -37 120 -63 147 -26 28 -32 30 -75 24 -145 -20 -502 -255 -733 -483 l-84 -84 -91 25 c-112 31 -220 53 -307 62 -38 4 -68 8 -68 10 0 2 14 47 30 99 31 94 31 95 63 95 116 1 224 102 234 221 15 163 -132 302 -287 270z m200 -1462 c349 -30 507 -116 609 -332 51 -108 66 -185 65 -337 -3 -466 -283 -755 -809 -836 -152 -24 -454 -14 -596 19 -464 109 -700 389 -699 830 0 210 51 351 169 467 139 137 260 177 611 200 144 10 483 4 650 -11z" />
                <path d="M1831 2488 c-52 -26 -107 -80 -128 -128 -22 -48 -21 -173 1 -222 39 -89 130 -147 229 -148 68 0 110 16 162 61 115 102 114 300 -4 400 -72 62 -179 77 -260 37z" />
                <path d="M2935 2489 c-169 -84 -199 -314 -57 -439 116 -102 288 -71 369 68 25 41 28 57 28 132 0 75 -3 91 -27 131 -32 54 -75 93 -125 114 -50 21 -140 18 -188 -6z" />
                <path d="M2005 1785 c-15 -14 -25 -36 -25 -52 0 -58 151 -162 305 -210 47 -14 91 -18 205 -17 129 0 154 3 225 27 94 31 187 84 233 132 50 54 42 121 -18 140 -23 7 -52 -7 -94 -47 -86 -84 -262 -130 -422 -111 -116 14 -189 42 -277 109 -40 30 -80 54 -90 54 -10 0 -29 -11 -42 -25z" />
              </g>
            </svg>
          </div>
        </CardTitle>
        <CardDescription className="text-lg text-foreground text-center mt-2">
          Get started with Redditime
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <RedditLoginButton className="w-full md:w-3/4 rounded-sm">
          <FaRedditAlien />
          <span className="ml-2">Continue with Reddit</span>
        </RedditLoginButton>
      </CardContent>
    </Card>
  );
}
