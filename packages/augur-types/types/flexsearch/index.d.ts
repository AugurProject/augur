// This is a modified version of FlexSearch's index.d.ts.
// It includes an additional signature for the `add` function
// and modifies the signatures for the `search` & `where` functions.
// Ideally, it can be removed in the future, once FlexSearch's
// TypeScript definitions are more complete.

declare module "flexsearch" {
  interface Index<T> {
    readonly id: string;
    readonly index: string;
    readonly length: number;

    init();
    init(options: CreateOptions);
    add(id: number, o: T):this;
    add(o: T): void;
    search(query: string, options: number | SearchOptions, callback: (results: SearchResults<T>) => void): void;
    search(query: string, options?: number | SearchOptions): Promise<Array<SearchResults<T>>>;
    search(options: SearchOptions & {query: string}, callback: (results: SearchResults<T>) => void): void;
    search(options: SearchOptions & {query: string}): Promise<SearchResults<T>>;
    update(id: number, o: T);
    remove(id: number);
    clear();
    destroy();
    addMatcher(matcher: Matcher):this;
    where(whereFn: (o: T) => boolean): Promise<Array<SearchResults<T>>>;
    where(whereObj: {[key: string]: string});
    encode(str: string): string;
    export(): string;
    import(exported: string);
  }

  interface SearchOptions {
      limit?: number,
      suggest?: boolean,
      where?: {[key: string]: string},
      field?: string[],
      bool?: "and" | "or" | "not"
      page?: boolean | Cursor;
      sort?: (a, b)=>boolean | string;
  }

  interface SearchResults<T> {
      page?: Cursor,
      next?: Cursor,
      result: SearchResult[]
  }

  type SearchResult = number;

  export type CreateOptions = {
    profile?: IndexProfile;
    tokenize?: DefaultTokenizer | TokenizerFn;
    split?: RegExp;
    encode?: DefaultEncoder | EncoderFn | false;
    cache?: boolean | number;
    async?: boolean;
    worker?: false | number;
    depth?: false | number;
    threshold?: false | number;
    resolution?: number;
    stemmer?: Stemmer | string | false;
    filter?: FilterFn | string | false;
    rtl?: boolean;
  };

//   limit	number	Sets the limit of results.
// suggest	true, false	Enables suggestions in results.
// where	object	Use a where-clause for non-indexed fields.
// field	string, Array<string>	Sets the document fields which should be searched. When no field is set, all fields will be searched. Custom options per field are also supported.
// bool	"and", "or"	Sets the used logical operator when searching through multiple fields.
// page	true, false, cursor	Enables paginated results.

  type IndexProfile = "memory" | "speed" | "match" | "score" | "balance" | "fast";
  type DefaultTokenizer = "strict" | "forward" | "reverse" | "full";
  type TokenizerFn = (str: string) => string[];
  type DefaultEncoder = "icase" | "simple" | "advanced" | "extra" | "balance";
  type EncoderFn = (str: string) => string;
  type Stemmer = {[key: string]: string};
  type Matcher = {[key: string]: string};
  type FilterFn = (str: string) => boolean;
  type Cursor = string;

  export default class FlexSearch {
    static create(options?: CreateOptions): Index;
    static registerMatcher(matcher: Matcher);
    static registerEncoder(name: string, encoder: EncoderFn);
    static registerLanguage(lang: string, options: { stemmer?: Stemmer; filter?: string[] });
    static encode(name: string, str: string);
  }
}

// FlexSearch.create(<options>)
// FlexSearch.registerMatcher({KEY: VALUE})
// FlexSearch.registerEncoder(name, encoder)
// FlexSearch.registerLanguage(lang, {stemmer:{}, filter:[]})
// FlexSearch.encode(name, string)
