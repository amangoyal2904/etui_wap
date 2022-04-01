import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

// eslint-disable-next-line
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next();
  return response;
}
