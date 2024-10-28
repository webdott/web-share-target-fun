import { type NextRequest, NextResponse } from "next/server";
import { fetchTweetBack } from "@/server/twitter";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "No tweet ID provided" },
        { status: 400 },
      );
    }

    const tweet = await fetchTweetBack(id);
    return NextResponse.json({ tweet });
  } catch (error) {
    console.error(error, "here");
    return NextResponse.json(
      { error: "Failed to fetch tweet" },
      { status: 500 },
    );
  }
};
