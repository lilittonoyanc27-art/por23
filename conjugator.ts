import { VerbQuestion, SpanishTense, SportType } from './types';

interface VerbData {
  spanish: string;
  armenian: string;
  indefinido: string[]; // 6 elements [yo, tú, él, nosotros, vosotros, ellos]
  imperfecto: string[]; // 6 elements
  perfecto: string[]; // 6 elements
  armIndefinido: string[]; // 6 elements
  armImperfecto: string[]; // 6 elements
  armPerfecto: string[]; // 6 elements
}

const VERBS_DATABASE: VerbData[] = [
  {
    spanish: 'hablar',
    armenian: 'խոսել',
    indefinido: ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron'],
    imperfecto: ['hablaba', 'hablabas', 'hablaba', 'hablábamos', 'hablabais', 'hablaban'],
    perfecto: ['he hablado', 'has hablado', 'ha hablado', 'hemos hablado', 'habéis hablado', 'han hablado'],
    armIndefinido: ['ես խոսեցի', 'դու խոսեցիր', 'նա խոսեց', 'մենք խոսեցինք', 'դուք խոսեցիք', 'նրանք խոսեցին'],
    armImperfecto: ['ես խոսում էի', 'դու խոսում էիր', 'նա խոսում էր', 'մենք խոսում էինք', 'դուք խոսում էիք', 'նրանք խոսում էին'],
    armPerfecto: ['ես խոսել եմ', 'դու խոսել ես', 'նա խոսել է', 'մենք խոսել ենք', 'դուք խոսել եք', 'նրանք խոսել են']
  },
  {
    spanish: 'comer',
    armenian: 'ուտել',
    indefinido: ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron'],
    imperfecto: ['comía', 'comías', 'comía', 'comíamos', 'comíais', 'comían'],
    perfecto: ['he comido', 'has comido', 'ha comido', 'hemos comido', 'habéis comido', 'han comido'],
    armIndefinido: ['ես կերա', 'դու կերար', 'նա կերավ', 'մենք կերանք', 'դուք կերաք', 'նրանք կերան'],
    armImperfecto: ['ես ուտում էի', 'դու ուտում էիր', 'նա ուտում էր', 'մենք ուտում էինք', 'դուք ուտում էիք', 'նրանք ուտում էին'],
    armPerfecto: ['ես կերել եմ', 'դու կերել ես', 'նա կերել է', 'մենք կերել ենք', 'դուք կերել եք', 'նրանք կերել են']
  },
  {
    spanish: 'escribir',
    armenian: 'գրել',
    indefinido: ['escribí', 'escribiste', 'escribió', 'escribimos', 'escribisteis', 'escribieron'],
    imperfecto: ['escribía', 'escribías', 'escribía', 'escribíamos', 'escribíais', 'escribían'],
    perfecto: ['he escrito', 'has escrito', 'ha escrito', 'hemos escrito', 'habéis escrito', 'han escrito'],
    armIndefinido: ['ես գրեցի', 'դու գրեցիր', 'նա գրեց', 'մենք գրեցինք', 'դուք գրեցիք', 'նրանք գրեցին'],
    armImperfecto: ['ես գրում էի', 'դու գրում էիր', 'նա գրում էր', 'մենք գրում էինք', 'դուք գրում էիք', 'նրանք գրում էին'],
    armPerfecto: ['ես գրել եմ', 'դու գրել ես', 'նա գրել է', 'մենք գրել ենք', 'դուք գրել եք', 'նրանք գրել են']
  },
  {
    spanish: 'ir',
    armenian: 'գնալ',
    indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    imperfecto: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
    perfecto: ['he ido', 'has ido', 'ha ido', 'hemos ido', 'habéis ido', 'han ido'],
    armIndefinido: ['ես գնացի', 'դու գնացիր', 'նա գնաց', 'մենք գնացինք', 'դուք գնացիք', 'նրանք գնացին'],
    armImperfecto: ['ես գնում էի', 'դու գնում էիր', 'նա գնում էր', 'մենք գնում էինք', 'դուք գնում էիք', 'նրանք գնում էին'],
    armPerfecto: ['ես գնացել եմ', 'դու գնացել ես', 'նա գնացել է', 'մենք գնացել ենք', 'դուք գնացել եք', 'նրանք գնացել են']
  },
  {
    spanish: 'hacer',
    armenian: 'անել',
    indefinido: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'],
    imperfecto: ['hacía', 'hacías', 'hacía', 'hacíamos', 'hacíais', 'hacían'],
    perfecto: ['he hecho', 'has hecho', 'ha hecho', 'hemos hecho', 'habéis hecho', 'han hecho'],
    armIndefinido: ['ես արեցի', 'դու արեցիր', 'նա արեց', 'մենք արեցինք', 'դուք արեցիք', 'նրանք արեցին'],
    armImperfecto: ['ես անում էի', 'դու անում էիր', 'նա անում էր', 'մենք անում էինք', 'դուք անում էիք', 'նրանք անում էին'],
    armPerfecto: ['ես արել եմ', 'դու արել ես', 'նա արել է', 'մենք արել ենք', 'դուք արել եք', 'նրանք արել են']
  },
  {
    spanish: 'tener',
    armenian: 'ունենալ',
    indefinido: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'],
    imperfecto: ['tenía', 'tenías', 'tenía', 'teníamos', 'teníais', 'tenían'],
    perfecto: ['he tenido', 'has tenido', 'ha tenido', 'hemos tenido', 'habéis tenido', 'han tenido'],
    armIndefinido: ['ես ունեցա', 'դու ունեցար', 'նա ունեցավ', 'մենք ունեցանք', 'դուք ունեցաք', 'նրանք ունեցան'],
    armImperfecto: ['ես ունենում էի', 'դու ունենում էիր', 'նա ունենում էր', 'մենք ունենում էինք', 'դուք ունենում էիք', 'նրանք ունենում էին'],
    armPerfecto: ['ես ունեցել եմ', 'դու ունեցել ես', 'նա ունեցել է', 'մենք ունեցել ենք', 'դուք ունեցել եք', 'նրանք ունեցել են']
  },
  {
    spanish: 'ver',
    armenian: 'տեսնել',
    indefinido: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
    imperfecto: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
    perfecto: ['he visto', 'has visto', 'ha visto', 'hemos visto', 'habéis visto', 'han visto'],
    armIndefinido: ['ես տեսա', 'դու տեսար', 'նա տեսավ', 'մենք տեսանք', 'դուք տեսաք', 'նրանք տեսան'],
    armImperfecto: ['ես տեսնում էի', 'դու տեսնում էիր', 'նա տեսնում էր', 'մենք տեսնում էինք', 'դուք տեսնում էիք', 'նրանք տեսնում էին'],
    armPerfecto: ['ես տեսել եմ', 'դու տեսել ես', 'նա տեսել է', 'մենք տեսել ենք', 'դուք տեսել եք', 'նրանք տեսել են']
  },
  {
    spanish: 'ser',
    armenian: 'լինել',
    indefinido: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
    imperfecto: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
    perfecto: ['he sido', 'has sido', 'ha sido', 'hemos sido', 'habéis sido', 'han sido'],
    armIndefinido: ['ես եղա', 'դու եղար', 'նա եղավ', 'մենք եղանք', 'դուք եղաք', 'նրանք եղան'],
    armImperfecto: ['ես էի', 'դու էիր', 'նա էր', 'մենք էինք', 'դուք էիք', 'նրանք էին'],
    armPerfecto: ['ես եղել եմ', 'դու եղել ես', 'նա եղել է', 'մենք եղել ենք', 'դուք եղել եք', 'նրանք եղել են']
  },
  {
    spanish: 'comprar',
    armenian: 'գնել',
    indefinido: ['compré', 'compraste', 'compró', 'compramos', 'comprasteis', 'compraron'],
    imperfecto: ['compraba', 'comprabas', 'compraba', 'comprábamos', 'comprabais', 'compraban'],
    perfecto: ['he comprado', 'has comprado', 'ha comprado', 'hemos comprado', 'habéis comprado', 'han comprado'],
    armIndefinido: ['ես գնեցի', 'դու գնեցիր', 'նա գնեց', 'մենք գնեցինք', 'դուք գնեցիք', 'նրանք գնեցին'],
    armImperfecto: ['ես գնում էի', 'դու գնում էիր', 'նա գնում էր', 'մենք գնում էինք', 'դուք գնում էիք', 'նրանք գնում էին'],
    armPerfecto: ['ես գնել եմ', 'դու գնել ես', 'նա գնել է', 'մենք գնել ենք', 'դուք գնել եք', 'նրանք գնել են']
  },
  {
    spanish: 'vivir',
    armenian: 'ապրել',
    indefinido: ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron'],
    imperfecto: ['vivía', 'vivías', 'vivía', 'vivíamos', 'vivíais', 'vivían'],
    perfecto: ['he vivido', 'has vivido', 'ha vivido', 'hemos vivido', 'habéis vivido', 'han vivido'],
    armIndefinido: ['ես ապրեցի', 'դու ապրեցիր', 'նա ապրեց', 'մենք ապրեցնիք', 'դուք ապրեցիք', 'նրանք ապրեցին'],
    armImperfecto: ['ես ապրում էի', 'դու ապրում էիր', 'նա ապրում էր', 'մենք ապրում էինք', 'դուք ապրում էիք', 'նրանք ապրում էին'],
    armPerfecto: ['ես ապրել եմ', 'դու ապրել ես', 'նա ապրել է', 'մենք ապրել ենք', 'դուք ապրել եք', 'նրանք ապրել են']
  }
];

const EN_PRONOUNS_ESP = ['yo', 'tú', 'él / ella', 'nosotros', 'vosotros', 'ellos / ellas'];
const EN_PRONOUNS_ARM = ['ես', 'դու', 'նա', 'մենք', 'դուք', 'նրանք'];

const TENSE_NAMES_ARM: Record<SpanishTense, string> = {
  indefinido: 'Անցյալ կատարյալ (Indefinido)',
  imperfecto: 'Անցյալ անկատար (Imperfecto)',
  perfecto: 'Վաղակատար անցյալ (Perfecto)'
};

const TENSE_HINTS: Record<SpanishTense, string> = {
  indefinido: 'Մեկանգամյա, ավարտված գործողություն անցյալում (e.g., -é, -í, -ó).',
  imperfecto: 'Շարունակական, կրկնվող կամ սովորութային գործողություն անցյալում (e.g., -aba, -ía).',
  perfecto: 'Ներկայի հետ կապված վերջերս կատարված գործողություն (he, has, ha... + participio).'
};

export function generateQuestion(sport: SportType, count: number = 1): VerbQuestion[] {
  const tenses: SpanishTense[] = ['indefinido', 'imperfecto', 'perfecto'];
  
  // Custom sport mapping to create thematic focus (e.g., Football prefers Indefinido for sudden actions)
  let preferredTense: SpanishTense | null = null;
  if (sport === 'football') preferredTense = 'indefinido';
  else if (sport === 'basketball') preferredTense = 'imperfecto';
  else if (sport === 'archery') preferredTense = 'perfecto';
  
  const questions: VerbQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const verb = VERBS_DATABASE[Math.floor(Math.random() * VERBS_DATABASE.length)];
    const tense = preferredTense || tenses[Math.floor(Math.random() * tenses.length)];
    const personIndex = Math.floor(Math.random() * 6);
    
    const pronounArm = EN_PRONOUNS_ARM[personIndex];
    const pronounEsp = EN_PRONOUNS_ESP[personIndex];
    
    let armenianPhrase = '';
    let correctAnswer = '';
    
    if (tense === 'indefinido') {
      armenianPhrase = verb.armIndefinido[personIndex];
      correctAnswer = verb.indefinido[personIndex];
    } else if (tense === 'imperfecto') {
      armenianPhrase = verb.armImperfecto[personIndex];
      correctAnswer = verb.imperfecto[personIndex];
    } else {
      armenianPhrase = verb.armPerfecto[personIndex];
      correctAnswer = verb.perfecto[personIndex];
    }
    
    // Generate incorrect options
    const optionSet = new Set<string>();
    optionSet.add(correctAnswer);
    
    // Pass 1: Try same verb with different person or tense
    let attempts = 0;
    while (optionSet.size < 4 && attempts < 15) {
      attempts++;
      const randomTense = tenses[Math.floor(Math.random() * tenses.length)];
      const randomPerson = Math.floor(Math.random() * 6);
      let alternateTerm = '';
      if (randomTense === 'indefinido') {
        alternateTerm = verb.indefinido[randomPerson];
      } else if (randomTense === 'imperfecto') {
        alternateTerm = verb.imperfecto[randomPerson];
      } else {
        alternateTerm = verb.perfecto[randomPerson];
      }
      if (alternateTerm) optionSet.add(alternateTerm);
    }
    
    // Pass 2: If we still need options, pick random correct keys of other verbs in same tense
    attempts = 0;
    while (optionSet.size < 4 && attempts < 15) {
      attempts++;
      const otherVerb = VERBS_DATABASE[Math.floor(Math.random() * VERBS_DATABASE.length)];
      const randomPerson = Math.floor(Math.random() * 6);
      let alternateTerm = '';
      if (tense === 'indefinido') {
        alternateTerm = otherVerb.indefinido[randomPerson];
      } else if (tense === 'imperfecto') {
        alternateTerm = otherVerb.imperfecto[randomPerson];
      } else {
        alternateTerm = otherVerb.perfecto[randomPerson];
      }
      if (alternateTerm) optionSet.add(alternateTerm);
    }

    // Ensure we have 4 options
    while (optionSet.size < 4) {
      const otherVerb = VERBS_DATABASE[Math.floor(Math.random() * VERBS_DATABASE.length)];
      optionSet.add(otherVerb.indefinido[Math.floor(Math.random() * 6)]);
    }
    
    const options = Array.from(optionSet).sort(() => Math.random() - 0.5);
    
    questions.push({
      id: `${sport}_${i}_${Date.now()}_${Math.random()}`,
      verbSpanish: verb.spanish,
      verbArmenian: verb.armenian,
      tense,
      tenseNameArm: TENSE_NAMES_ARM[tense],
      pronounArm,
      pronounEsp,
      armenianPhrase,
      correctAnswer,
      options,
      hint: TENSE_HINTS[tense]
    });
  }
  
  return questions;
}
