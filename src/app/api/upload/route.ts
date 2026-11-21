import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize file name
    const ext = path.extname(file.name) || '.jpg';
    const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'products');

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, cleanName);
    await writeFile(filePath, buffer);

    const publicUrl = `/products/${cleanName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: cleanName,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
