import z from "zod";

export const portSchema = z.number().int().positive().max(65535).default(8421);
