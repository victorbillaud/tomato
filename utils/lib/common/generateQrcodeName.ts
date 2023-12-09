// Generate a random name for the Qrcodes using one fruit/vegetable from the list and one adjectiv

import { fruitsVegetables } from './data/fruits-vegetables';
import { adjectives } from './data/adjectives';

export type Language = 'en';

export const generateQRCodeName = (language: Language = 'en'): string => {
  const fruitVegetable =
    fruitsVegetables[language][
      Math.floor(Math.random() * fruitsVegetables[language].length)
    ];
  const adjective =
    adjectives[language][
      Math.floor(Math.random() * adjectives[language].length)
    ];

  return `${adjective} ${fruitVegetable}`;
};
