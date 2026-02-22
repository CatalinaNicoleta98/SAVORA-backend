import {Request, Response} from 'express';
import {recipeModel} from '../models/recipeModel';

const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"] as const;

type AllowedDifficulty = (typeof ALLOWED_DIFFICULTIES)[number];

function isAllowedDifficulty(value: unknown): value is AllowedDifficulty {
    return typeof value === "string" && (ALLOWED_DIFFICULTIES as readonly string[]).includes(value);
}

function parseStringArray(value: unknown): string[] | undefined {
    if (value === undefined || value === null) return undefined;

    if (Array.isArray(value)) {
        return value
            .filter((x) => typeof x === "string")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (typeof value !== "string") return undefined;

    const raw = value.trim();
    if (!raw) return [];

    // JSON array string support: '["a","b"]'
    if (raw.startsWith("[") && raw.endsWith("]")) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed
                    .filter((x) => typeof x === "string")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        } catch {
            // fall through to CSV parsing
        }
    }

    // CSV support: 'a, b, c'
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function normalizeRecipeBody(body: any) {
    const normalized: any = { ...body };

    const ingredients = parseStringArray(body?.ingredients);
    if (ingredients !== undefined) normalized.ingredients = ingredients;

    const tags = parseStringArray(body?.tags);
    if (tags !== undefined) normalized.tags = tags;

    const diet = parseStringArray(body?.diet);
    if (diet !== undefined) normalized.diet = diet;

    const allergens = parseStringArray(body?.allergens);
    if (allergens !== undefined) normalized.allergens = allergens;

    return normalized;
}

//CRUD - Create, Read/get, Update, Delete
//creates new entry book in the data source based on the request body
export async function createRecipe(req: Request, res: Response): Promise<void> {
    try {

        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Validate difficulty if provided
        const { difficulty } = req.body as { difficulty?: unknown };
        if (difficulty !== undefined && !isAllowedDifficulty(difficulty)) {
            res.status(400).json({ error: 'Invalid difficulty. Use easy, medium, or hard.' });
            return;
        }

        const normalizedBody = normalizeRecipeBody(req.body);

        // If multer is used on the route, an uploaded file will be available here.
        const file = (req as any).file as { filename?: string } | undefined;
        if (file?.filename) {
            normalizedBody.image = `/uploads/${file.filename}`;
        }

        // Never trust the client to set ownership
        const data = { ...normalizedBody, createdBy: req.userId };

        const recipe = new recipeModel(data);
        const result = await recipe.save();

        res.status(201).send(result);
    } catch (error) {
        res.status(500).send('Error creating recipe entry. Error: ' + error);
    }
}


//retieves all recipes from the data source

export async function getAllRecipes(req: Request, res: Response) {
    try {

        // Query params supported:
        // q, tags, diet, allergens, createdBy, page, limit, sort (newest|oldest)
        const {
            q,
            tags,
            diet,
            allergens,
            difficulty,
            createdBy,
            page = '1',
            limit = '20',
            sort = 'newest',
        } = req.query as Record<string, string>;

        const filter: Record<string, any> = {};

        if (createdBy) {
            filter.createdBy = createdBy;
        }

        const parseCsv = (value?: string) =>
            (value || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);

        const tagsArr = parseCsv(tags);
        if (tagsArr.length) {
            filter.tags = { $in: tagsArr };
        }

        const dietArr = parseCsv(diet);
        if (dietArr.length) {
            filter.diet = { $in: dietArr };
        }

        const allergensArr = parseCsv(allergens);
        if (allergensArr.length) {
            filter.allergens = { $in: allergensArr };
        }

        if (difficulty && difficulty !== 'all') {
            if (!isAllowedDifficulty(difficulty)) {
                res.status(400).json({ error: 'Invalid difficulty. Use easy, medium, or hard.' });
                return;
            }
            filter.difficulty = difficulty;
        }

        // Basic text search (regex). Works without needing DB indexes.
        if (q && q.trim().length) {
            const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(safe, 'i');
            filter.$or = [
                { title: regex },
                { fullRecipe: regex },
                { ingredients: regex },
                { tags: regex },
            ];
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        const sortObj: any = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

        const [items, total] = await Promise.all([
            recipeModel.find(filter).sort(sortObj).skip(skip).limit(limitNum),
            recipeModel.countDocuments(filter),
        ]);

        res.status(200).json({
            error: null,
            data: items,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        res.status(500).send('error retrieving recipes. Error: ' + error);
    }
} 

//retrieves a recipe entry by id from the data source
export async function getRecipeById(req: Request, res: Response) {
    try {

        const id = req.params.id;
        const result = await recipeModel.findById(id);

        if (!result) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send('error retrieving recipes. Error: ' + error);
    }
} 

//updates a recipe entry by id in the data source based on the request body
export async function updateRecipeById(req: Request, res: Response) {
    const id = req.params.id;

    try {

        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const existing = await recipeModel.findById(id);
        if (!existing) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        if (String(existing.createdBy) !== String(req.userId)) {
            res.status(403).json({ error: 'Forbidden, you can only update your own recipes' });
            return;
        }

        // Never allow changing ownership via update
        // Validate difficulty if provided
        const { difficulty } = req.body as { difficulty?: unknown };
        if (difficulty !== undefined && !isAllowedDifficulty(difficulty)) {
            res.status(400).json({ error: 'Invalid difficulty. Use easy, medium, or hard.' });
            return;
        }

        const normalizedBody = normalizeRecipeBody(req.body);

        const file = (req as any).file as { filename?: string } | undefined;
        if (file?.filename) {
            normalizedBody.image = `/uploads/${file.filename}`;
        }

        const { createdBy, ...safeBody } = normalizedBody;

        const updated = await recipeModel.findByIdAndUpdate(id, safeBody, { new: true });

        res.status(200).json({ error: null, data: updated });
    } catch (error) {
        res.status(500).send('Error updating recipe entry by id. Error: ' + error);
    }
}

//deletes a recipe entry by id from the data source
export async function deleteRecipeById(req: Request, res: Response) {
    const id = req.params.id;

    try {

        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const existing = await recipeModel.findById(id);
        if (!existing) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        if (String(existing.createdBy) !== String(req.userId)) {
            res.status(403).json({ error: 'Forbidden, you can only delete your own recipes' });
            return;
        }

        await recipeModel.findByIdAndDelete(id);

        res.status(200).json({ error: null, data: 'Recipe entry was deleted successfully.' });
    } catch (error) {
        res.status(500).send('Error deleting recipe entry by id. Error: ' + error);
    }
} 
