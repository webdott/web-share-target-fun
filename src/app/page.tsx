"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

interface TweetResult {
  id: string;
  text: string;
  name: string;
  date: string;
  img: string;
  url: string;
  error?: string;
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

        const data = await fetch(`/api/tweet/${tweetId}`);
        const tweetData = (await data.json()) as {
          tweet?: TweetResult;
          error?: string;
        };
        if (!!tweetData.error) return ["", null];

        return [tweetId.toString(), tweetData.tweet!];
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

  useEffect(() => {
    const tweets = JSON.parse(
      localStorage.getItem("webshare_tweets") ?? "{}",
    ) as Record<string, TweetResult>;

    setBookmarkedTweets(Object.values(tweets));
  }, []);

  return (
    <div className="container flex flex-col items-center gap-12 p-4 py-10">
      <h2 className="self-start text-left text-3xl">Bookmarked Tweets</h2>

      <ul className="flex w-full flex-col gap-4">
        {bookmarkedTweets.map((tweet) => (
          <li
            key={tweet.id}
            className="flex w-full items-stretch gap-4 rounded-md px-2 py-2 hover:bg-neutral-700 hover:shadow-md"
          >
            <Image
              src={tweet.img}
              alt="Tweet"
              width={92}
              height={92}
              className="min-h-[92px] min-w-[92px] rounded-md"
            />

            <div className="flex flex-col justify-between gap-y-2 py-2">
              <p className="font-openSans">{tweet.text}</p>

              <div className="flex items-center gap-2 italic">
                <p>@{tweet.name}</p>
                &middot;
                <p>{formatDistanceToNow(tweet.date)} ago</p>
              </div>
            </div>

            <div className="ml-auto flex flex-col items-center justify-between justify-self-end py-2">
              <Link href={tweet.url} className="block hover:text-blue-500">
                <RxExternalLink className="h-5 w-5" />
              </Link>

              <button
                className="block hover:text-red-500"
                onClick={() => removeTweet(tweet.id)}
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}

        {bookmarkedTweets.length === 0 && (
          <p className="text-center text-lg">No tweets bookmarked yet</p>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
