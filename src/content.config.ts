import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WNIOSEK_STATUSES } from './lib/wniosekStatus';

// Jeden wniosek = jedna sprawa prowadzona z instytucją: pismo, jego oś czasu (kolejne statusy
// z opcjonalnymi terminami) i powiązany dokument. Pola muszą się zgadzać 1:1 z
// public/admin/config.yml (kolekcja "wnioski") — Decap i Astro czytają ten sam front matter,
// ale nie dzielą jednego źródła prawdy, więc zmiana pola wymaga edycji w obu miejscach.
const wnioski = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wnioski' }),
  schema: z.object({
    tytul: z.string(),
    instytucja: z.string().optional(),
    // Główny dokument sprawy (PDF/skan) do podglądu — patrz DocumentPreview.astro.
    dokument: z.string().optional(),
    zalaczniki: z
      .array(
        z.object({
          nazwa: z.string(),
          plik: z.string(),
        }),
      )
      .default([]),
    // Oś czasu: każdy krok to wejście w dany status, z opcjonalnym terminem (w dniach) —
    // patrz src/lib/stepAssessment.ts. Aktualny status sprawy to status ostatniego (wg daty)
    // kroku, nie osobne pole — dzięki temu nie da się rozjechać z osią czasu.
    kroki: z
      .array(
        z.object({
          status: z.enum(WNIOSEK_STATUSES),
          data: z.coerce.date(),
          opis: z.string().optional(),
          deadlineDni: z.number().int().min(1).max(366).optional(),
        }),
      )
      .min(1),
  }),
});

export const collections = { wnioski };
