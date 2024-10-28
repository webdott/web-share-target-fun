export const fetchTweetBack = async (id: string) => {
  try {
    const tweet = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=0`,
      {
        headers: { "User-Agent": "Chrome/125" },
      },
    );

    const tweetData = (await tweet.json()) as Record<string, unknown>;

    return {
      id: tweetData.id_str as string,
      text: tweetData.text as string,
      name: (tweetData.user as Record<string, unknown>).screen_name as string,
      date: tweetData.created_at as string,
      img: (tweetData.user as Record<string, unknown>)
        .profile_image_url_https as string,
      url: `https://x.com/${
        (tweetData.user as Record<string, unknown>).screen_name as string
      }/status/${id}`,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
