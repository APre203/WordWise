// is routable
// if you name it something other than route.js like db.js then it would not be routable
import { NextResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: {[key:string]:string[]}
}
export async function GET(
    // req: NextApiRequest,
    // res: NextApiResponse<ResponseData>
) {
    return NextResponse.json({
        hello:"world"
    })
    // const data: {[key:string]:string[]} = {'hello': ['hi']} 
    // res.status(200).json({ message: data})
}

export async function POST(
    req: Request,
    // res: NextApiResponse<ResponseData>
) {
    const data = await req.json()
    return NextResponse.json({
        data
    })
    // const data: {[key:string]:string[]} = {'hello': ['hi']} 
    // res.status(200).json({ message: data})
}