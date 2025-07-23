import { useRouter, useSearchParams } from 'next/navigation';
import { useReducer } from 'react';

import { searchParamsSchema } from '@/lib/searchParamsSchema';

// 状態の型定義
type SearchFormState = {
  isOpen: boolean;
  slug: string;
  name: string;
  selectedTypes: string[];
};

// アクションの型定義
type SearchFormAction =
  | { type: 'TOGGLE_MODAL' }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_POKEDEX'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'TOGGLE_TYPE'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'SYNC_FROM_URL'; payload: Partial<SearchFormState> };

// Reducer関数
function searchFormReducer(state: SearchFormState, action: SearchFormAction): SearchFormState {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };

    case 'SET_POKEDEX':
      return { ...state, slug: action.payload };

    case 'SET_NAME':
      return { ...state, name: action.payload };

    case 'TOGGLE_TYPE': {
      const typeSlug = action.payload;
      const { selectedTypes } = state;

      // 既に選択されている場合は除去
      if (selectedTypes.includes(typeSlug)) {
        return {
          ...state,
          selectedTypes: selectedTypes.filter((t) => t !== typeSlug),
        };
      }

      // 2個未満の場合は追加
      if (selectedTypes.length < 2) {
        return {
          ...state,
          selectedTypes: [...selectedTypes, typeSlug],
        };
      }

      // 2個の場合は最初のものを置換
      return {
        ...state,
        selectedTypes: [typeSlug, ...selectedTypes.slice(0, 1)],
      };
    }

    case 'SYNC_FROM_URL':
      return { ...state, ...action.payload };

    case 'RESET_FORM':
      return {
        isOpen: false,
        slug: 'national',
        name: '',
        selectedTypes: [],
      };

    default:
      return state;
  }
}

// カスタムフック
export function useSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータを解析
  const paramsObj = Object.fromEntries(searchParams.entries());
  const parsedParams = searchParamsSchema.safeParse(paramsObj);
  const params = parsedParams.success ? parsedParams.data : searchParamsSchema.parse({});

  // 初期状態
  const initialState: SearchFormState = {
    isOpen: false,
    slug: params.pokedex,
    name: params.name,
    selectedTypes: [params.type1, params.type2].filter((t): t is string => typeof t === 'string' && t.length > 0),
  };

  const [state, dispatch] = useReducer(searchFormReducer, initialState);

  // アクション作成関数
  const actions = {
    toggleModal: () => dispatch({ type: 'TOGGLE_MODAL' }),
    setOpen: (isOpen: boolean) => dispatch({ type: 'SET_OPEN', payload: isOpen }),
    setPokedex: (slug: string) => dispatch({ type: 'SET_POKEDEX', payload: slug }),
    setName: (name: string) => dispatch({ type: 'SET_NAME', payload: name }),
    toggleType: (typeSlug: string) => dispatch({ type: 'TOGGLE_TYPE', payload: typeSlug }),
    resetForm: () => dispatch({ type: 'RESET_FORM' }),

    // 検索実行
    handleApply: () => {
      const [type1 = '', type2 = ''] = state.selectedTypes;
      const url = `?pokedex=${state.slug}&page=1&name=${encodeURIComponent(state.name)}&type1=${type1}&type2=${type2}`;
      router.push(url);
      dispatch({ type: 'SET_OPEN', payload: false });
    },
  };

  return {
    state,
    actions,
  };
}
