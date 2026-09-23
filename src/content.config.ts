import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Jeden wpis = jedno zdarzenie w sprawie: pismo złożone, odpowiedź urzędu, notatka.
// Pola muszą się zgadzać 1:1 z public/admin/config.yml (kolekcja "wpisy") — Decap i Astro
// czytają ten sam front matter, ale nie dzielą jednego źródła prawdy, więc zmiana pola
// wymaga edycji w obu miejscach.
const wpisy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wpisy' }),
  schema: z.object({
    tytul: z.string(),
    data: z.coerce.date(),
    urzad: z.string().optional(),
    status: z.enum(['zlozone', 'w_toku', 'odpowiedz', 'zalatwione', 'odrzucone']),
    zalaczniki: z
      .array(
        z.object({
          nazwa: z.string(),
          plik: z.string(),
        }),
      )
      .default([]),
    // Ustawiane ręcznie przy edycji, nie liczone automatycznie — Decap i tak zna datę
    // commita, ale front matter jest czytelniejsze dla kogoś przeglądającego repo.
    zaktualizowano: z.coerce.date().optional(),
  }),
});

export const collections = { wpisy };
