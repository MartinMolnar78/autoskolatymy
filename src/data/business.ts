import type { Lang } from './content';

export const business = {
  legalName: 'Tibor Štrba AUTOŠKOLA TYMY',
  ico: '43962955',
  dic: '1047579038',
  vatId: 'SK1047579038',
  registrationNumber: '440-27001',
  registeredStreet: 'S. H. Vajanského 5659/4',
  registeredTown: '940 02 Nové Zámky',
  premisesStreet: 'Nábrežná 5779/39A',
} as const;

export const privacyPaths = {
  sk: '/sk/ochrana-sukromia/',
  hu: '/hu/adatvedelem/',
} satisfies Record<Lang, string>;

export const privacyLabels = {
  sk: 'Ochrana súkromia',
  hu: 'Adatvédelem',
} satisfies Record<Lang, string>;
