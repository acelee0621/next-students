import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


interface OriginRequest {    
    originName: string;
  }
  
  const prisma = new PrismaClient();
  
  export async function GET() {
    try {
      const origin = await prisma.origin.findMany({
        include:{
            character:true
        }
      });
      return NextResponse.json(
        {
          origin,
        },
        { status: 200 }
      );
    } catch (e) {
      console.error("🚀 ~ file: route.ts:18 ~ GET ~ e:", e);
      return NextResponse.json(
        {
          message: "Internal Error",
        },
        { status: 500 }
      );
    }
  }