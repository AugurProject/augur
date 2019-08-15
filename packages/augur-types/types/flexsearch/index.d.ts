// This is a modified version of FlexSearch's index.d.ts.
// It modifies the return types for the `search` function, adds
// return types for the `add` & `where` functions, and adds
// the `sort` property to the SearchOptions interface.
// Ideally, it can be removed in the future, once FlexSearch's
// TypeScript definitions are more complete.

declare module "flexsearch" {
  interface Index<T> {
    readonly id: string;
    readonly index: string;
    readonly length: number;

    init();
    init(options: CreateOptions);
    info();
    add(o: T): void;
    add(id: number, o: string): this; // Added return type for Augur

    // Result without pagination -> T[]
    // (Return types modified for Augur)
    search(query: string, options: number | SearchOptions, callback: (results: Array<SearchResults<T>>) => void): void;
    search(query: string, options?: number | SearchOptions): Promise<Array<SearchResults<T>>>;
    search(options: SearchOptions & {query: string}, callback: (results: Array<SearchResults<T>>) => void): void;
    search(options: SearchOptions & {query: string}): Promise<Array<SearchResults<T>>>;

    // Result with pagination -> SearchResults<T>
    search(query: string, options: number | SearchOptions & { page?: boolean | Cursor}, callback: (results: Array<SearchResults<T>>) => void): void;
    search(query: string, options?: number | SearchOptions & { page?: boolean | Cursor}): Promise<Array<SearchResults<T>>>;
    search(options: SearchOptions & {query: string, page?: boolean | Cursor}, callback: (results: Array<SearchResults<T>>) => void): void;
    search(options: SearchOptions & {query: string, page?: boolean | Cursor}): Promise<Array<SearchResults<T>>>;


    update(id: number, o: T);
    remove(id: number);
    clear();
    destroy();
    addMatcher(matcher: Matcher): this;

    where(whereFn: (o: T) => boolean): T[];
    where(whereObj: {[key: string]: string}): Promise<Array<SearchResults<T>>>; // Added return type for Augur
    encode(str: string): string;
    export(): string;
    import(exported: string);
  }

  interface SearchOptions {
    limit?: number,
    suggest?: boolean,
    where?: {[key: string]: string},
    field?: string | string[],
    bool?: "and" | "or" | "not"
    sort?: (a, b)=>boolean | string; // Added property for Augur
  }

  interface SearchResults<T> {
    page?: Cursor,
    next?: Cursor,
    result: T[]
  }

  interface Document {
      id: string;
      field: any;
  }


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
    doc?: Document;
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
    static create<T>(options?: CreateOptions): Index<T>;
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
