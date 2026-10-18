// Regras do kit de desenvolvimento (seção 9 do método): tamanho de arquivo e de função.
// No eslint.config.mjs do projeto, importe e inclua no fim da lista de configurações:
//
//   import regrasKit from './eslint.regras-kit.mjs';
//   const eslintConfig = defineConfig([...nextVitals, ...nextTs, ...regrasKit, globalIgnores([...])]);
//
// Para mudar os limites, ajuste os números aqui e registre no Perfil do projeto.

const LIMITE_ARQUIVO = 400;
const LIMITE_FUNCAO = 80;

const regrasKit = [
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      'max-lines': ['error', { max: LIMITE_ARQUIVO, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: LIMITE_FUNCAO, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // Testes agrupam muitos casos dentro de um describe: o limite de função não se aplica.
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', 'e2e/**', 'tests/**'],
    rules: { 'max-lines-per-function': 'off' },
  },
  {
    // Arquivos gerados não são escritos por pessoas nem por agentes.
    ignores: ['**/database.types.ts', '**/*.generated.*', '.next/**', 'coverage/**'],
  },
];

export default regrasKit;
