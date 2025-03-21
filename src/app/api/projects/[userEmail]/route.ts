import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.HOSTHIS_API_KEY;

  const searchParams = req.url;
  const userEmail = searchParams.split("/").pop();

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Env variable not found" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `${apiUrl}/V1/email/${userEmail}/projects`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Cannot fetch API" }, { status: 400 });
  }
}
