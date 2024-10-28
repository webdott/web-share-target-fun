"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

interface TweetResult {
  id: string;
  text: string;
}

const HomePage = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState<TweetResult[]>([]);

  const searchParams = useSearchParams();
  const text = searchParams.get("text");

  const fetchTweet = useCallback(
    async (tweetUrl: string): Promise<[string, TweetResult | null]> => {
      try {
        const tweetId = /[0-9]{19}/.exec(tweetUrl)?.[0];

        if (!tweetId) return ["", null];

        const response = await fetch(`/tweet?id=${tweetId}`);
        const data = (await response.json()) as TweetResult | null;

        return [tweetId.toString(), data];
      } catch (error) {
        console.error(error);
        return ["", null];
      }
    },
    [],
  );

  const saveTweet = useCallback(
    (tweetId: string, tweet: TweetResult): TweetResult[] => {
      const tweets = JSON.parse(
        localStorage.getItem("webshare_tweets") ?? "{}",
      ) as Record<string, TweetResult>;

      const existingTweet: TweetResult | undefined = tweets?.[tweetId];

      if (existingTweet) return Object.values(tweets);

      localStorage.setItem(
        "webshare_tweets",
        JSON.stringify({ ...tweets, [tweetId]: tweet }),
      );

      return Object.values(tweets);
    },
    [],
  );

  const fetchAndSaveTweet = useCallback(
    async (text: string | null) => {
      if (!text) return;

      const [tweetId, tweet] = await fetchTweet(text);

      if (!tweet) return;

      const newTweets = saveTweet(tweetId, tweet);

      setBookmarkedTweets(newTweets);
    },
    [fetchTweet, saveTweet],
  );

  const removeTweet = useCallback(
    (tweetId: string) => {
      const newTweets = bookmarkedTweets.filter((t) => t.id !== tweetId);

      const tweets = JSON.parse(
        localStorage.getItem("webshare_tweets") ?? "{}",
      ) as Record<string, TweetResult>;

      delete tweets[tweetId];

      localStorage.setItem("webshare_tweets", JSON.stringify(tweets));

      setBookmarkedTweets(newTweets);
    },
    [bookmarkedTweets],
  );

  useEffect(() => {
    void fetchAndSaveTweet(text);
  }, [text, fetchAndSaveTweet]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-12 p-4 py-10">
        <ul className="flex w-full flex-col gap-4">
          <li className="flex w-full items-stretch gap-4 rounded-md px-2 py-2 hover:bg-neutral-800 hover:shadow-md">
            <Image
              src="/favicons/web-app-manifest-144x144.png"
              alt="Tweet"
              width={92}
              height={92}
              className="rounded-md"
            />

            <div className="flex flex-col justify-between gap-y-2 py-2">
              <p>Tweet 1</p>

              <div className="flex items-center gap-2 italic">
                <p>@webdott</p>
                &middot;
                <p>5 days ago</p>
              </div>
            </div>

            <div className="ml-auto flex flex-col items-center justify-between justify-self-end py-2">
              <button className="hover:text-blue-500">
                <RxExternalLink className="h-5 w-5" />
              </button>

              <button
                className="hover:text-red-500"
                onClick={() => removeTweet("1")}
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default HomePage;
