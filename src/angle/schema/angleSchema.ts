import { Angle } from "../domain";

const validAngles: Angle[]= [
    "Time_Saving",
    "Money_Saving",
    "Growth",
    "Risk_Reduction",
];

export type AngleParseResult = 
    | { ok: true, value: Angle }
    | { ok:false, error: string };

export function parseAngle(raw: unknown): AngleParseResult {
    if(typeof raw !== "string" ) {
        return { ok:false, error: "Angle must be a string " };
    }

    if(!validAngles.includes(raw as Angle)) {
        return { ok: false, error: "Unsupported angle" };
    }

    return { ok: true, value: raw as Angle };
}
