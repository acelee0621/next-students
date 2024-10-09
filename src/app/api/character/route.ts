import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface CharacterRequest {
  id: string;  
  name: string;
  age: number;
  gender: string;
  address: string;
  originName: string;
}

const prisma = new PrismaClient();

export async function GET() {
  try {
    const character = await prisma.character.findMany();
    return NextResponse.json(
      {
        character,
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

export async function POST(request: NextRequest) {
  try {
    const newCharacter = (await request.json()) as CharacterRequest;

    let origin = await prisma.origin.findUnique({
      where: { originName: newCharacter.originName },
    });
    if (!origin) {
      origin = await prisma.origin.create({
        data: {
          originName: newCharacter.originName,
        },
      });
    }
    let character = await prisma.character.findUnique({
      where: { name: newCharacter.name },
    });
    if (!character) {
      character = await prisma.character.create({
        data: {
          name: newCharacter.name,
          age: newCharacter.age,
          gender: newCharacter.gender,
          address: newCharacter.address,
          originName: newCharacter.originName,
        },
      });
    }
    return NextResponse.json({ origin, character }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const id = url.searchParams.get("id") as string;
    const character = await prisma.character.findUnique({
      where: { id },
    });
    if (!character) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }
    await prisma.character.delete({ where: { id } });
    const characterCount = await prisma.character.count({
      where: { originName: character.originName },
    });
    if (characterCount === 0) {
      await prisma.origin.delete({
        where: { originName: character.originName },
      });
      return NextResponse.json(
        { message: "Origin deleted along with characters" },
        { status: 200 }
      );
    }
    return NextResponse.json({ message: "Character deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try{
    const newCharacter = (await request.json()) as CharacterRequest;
    const updateCharacter = await prisma.character.update({
      where: {
        id: newCharacter.id,
      },
      data: {
        name: newCharacter.name,
        age:newCharacter.age,
        gender: newCharacter.gender,
        address: newCharacter.address,
        originName: newCharacter.originName,
      },      
    });
    return NextResponse.json(updateCharacter, { status: 200 });
  }catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}