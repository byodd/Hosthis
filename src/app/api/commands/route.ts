import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function sendCommands(
  installCommand: string,
  buildCommand: string,
  launchCommand: string
) {
  const apiUrl = process.env.API_URL as string;

  const response = await fetch(`${apiUrl}/commands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      installCommand,
      buildCommand,
      launchCommand,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send commands");
  }
  return response.json();
}

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.HOSTHIS_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Env variable not found" },
      { status: 500 }
    );
  }
  const body = await req.json();
  console.log(body);

  try {
    const response = await axios.post(
      `${apiUrl}/commands`,
      {
        ...body,
      },
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
