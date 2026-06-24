const unsplash = (id: string, width = 800, height = 600) =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop`

/** Breed-matched dog photos sourced from Unsplash metadata */
export const dogImages = {
  goldenRetriever: {
    main: unsplash('photo-1552053831-71594a27632d'),
    gallery: [
      unsplash('photo-1552053831-71594a27632d', 400),
      unsplash('photo-1775806272302-879b04a870cf', 400),
    ],
  },
  australianShepherd: {
    main: unsplash('photo-1777360444787-ff1a17c32a7a'),
    gallery: [unsplash('photo-1777360444787-ff1a17c32a7a', 400)],
  },
  labradorRetriever: {
    main: unsplash('photo-1454880514290-e16436ce187a'),
    gallery: [unsplash('photo-1454880514290-e16436ce187a', 400)],
  },
  beagle: {
    main: unsplash('photo-1543466835-00a7907e9de1'),
    gallery: [unsplash('photo-1543466835-00a7907e9de1', 400)],
  },
  pitBullMix: {
    main: unsplash('photo-1601758228041-f3b2795255f1'),
    gallery: [unsplash('photo-1601758228041-f3b2795255f1', 400)],
  },
  chihuahuaMix: {
    main: unsplash('photo-1546527868-ccb7ee7dfa6a'),
    gallery: [unsplash('photo-1546527868-ccb7ee7dfa6a', 400)],
  },
  borderCollie: {
    main: unsplash('photo-1551717743-49959800b1f6'),
    gallery: [unsplash('photo-1551717743-49959800b1f6', 400)],
  },
  germanShepherd: {
    main: unsplash('photo-1693507078013-b4256d9baf9f'),
    gallery: [unsplash('photo-1693507078013-b4256d9baf9f', 400)],
  },
  cockerSpaniel: {
    main: unsplash('photo-1750924378381-3fbdfcdc67bb'),
    gallery: [unsplash('photo-1750924378381-3fbdfcdc67bb', 400)],
  },
  terrierMix: {
    main: unsplash('photo-1537151608828-ea2b11777ee8'),
    gallery: [unsplash('photo-1537151608828-ea2b11777ee8', 400)],
  },
  terrier: {
    main: unsplash('photo-1583337130417-3346a1be7dee'),
    gallery: [
      unsplash('photo-1583337130417-3346a1be7dee', 400),
      unsplash('photo-1535930891776-0c2dfb7fda1a', 400),
    ],
  },
} as const
