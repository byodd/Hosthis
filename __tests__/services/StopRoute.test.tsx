import axios from "axios";
import { POST } from "@/app/api/commands/[id]/stop/route";
import { NextRequest, NextResponse } from "next/server";

global.fetch = jest.fn();
global.Request = jest.fn().mockImplementation((url, init) => ({
  url,
  ...init,
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/server", () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    json: async () => (init?.body ? JSON.parse(init.body) : {}),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

describe("Stop Project Route", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      API_URL: "http://test-api.com",
      HOSTHIS_API_KEY: "test-key",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should stop project successfully", async () => {
    const mockResponse = {
      container: {
        status: false,
      },
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const request = new NextRequest(
      "http://localhost:3000/api/commands/123/stop",
      {
        method: "POST",
      }
    );

    const response = await POST(request, { params: { id: "123" } });
    const data = await response.json();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://test-api.com/V1/commands/123/stop",
      {},
      {
        headers: {
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        },
      }
    );
    expect(data).toEqual(mockResponse);
  });

  it("should return 500 when env variables are missing", async () => {
    process.env.API_URL = undefined;
    process.env.HOSTHIS_API_KEY = undefined;

    const request = new NextRequest(
      "http://localhost:3000/api/commands/123/stop",
      {
        method: "POST",
      }
    );

    const response = await POST(request, { params: { id: "123" } });
    const data = await response.json();

    expect(data).toEqual({ error: "Env variable not found" });
    expect(response.status).toBe(500);
  });

  it("should handle API errors", async () => {
    mockedAxios.post.mockRejectedValue(new Error("API Error"));

    const request = new NextRequest(
      "http://localhost:3000/api/commands/123/stop",
      {
        method: "POST",
      }
    );

    const response = await POST(request, { params: { id: "123" } });
    const data = await response.json();

    expect(data).toEqual({ message: "Cannot stop container" });
    expect(response.status).toBe(400);
  });
});
