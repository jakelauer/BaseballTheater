/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type ContentPreference = "CMS_FIRST" | "CMS_ONLY" | "MIXED" | "PLAY_ONLY" | "%future added value";
export type FeedPreference = "AWAY" | "BATTING_TEAM" | "CMS" | "HOME" | "NETWORK" | "PITCHING_TEAM" | "THREE_D_VIZ" | "WORLD" | "%future added value";
export type LanguagePreference = "EN" | "ES" | "%future added value";
export type QueryType = "FREETEXT" | "STRUCTURED" | "%future added value";
export type VideoFeedType = "AWAY" | "CMS" | "HOME" | "NETWORK" | "REEL" | "THREE_D_VIZ" | "UNKNOWN" | "WORLD" | "%future added value";
export type NewSearchQueryVariables = {
    queryType: QueryType;
    query: string;
    page?: number | null;
    limit?: number | null;
    feedPreference?: FeedPreference | null;
    languagePreference?: LanguagePreference | null;
    contentPreference?: ContentPreference | null;
};
export type NewSearchQueryResponse = {
    readonly search: {
        readonly total: number | null;
        readonly plays: ReadonlyArray<{
            readonly gameDate: string | null;
            readonly id: string;
            readonly gamePk: number | null;
            readonly mediaPlayback: ReadonlyArray<{
                readonly id: string;
                readonly slug: string | null;
                readonly blurb: string | null;
                readonly date: string | null;
                readonly description: string | null;
                readonly title: string | null;
                readonly canAddToReel: boolean | null;
                readonly feeds: ReadonlyArray<{
                    readonly type: VideoFeedType;
                    readonly duration: string | null;
                    readonly image: {
                        readonly altText: string;
                        readonly templateUrl: string | null;
                        readonly cuts: ReadonlyArray<{
                            readonly width: number | null;
                            readonly src: string | null;
                            readonly aspectRatio: string | null;
                        } | null>;
                    } | null;
                    readonly playbacks: ReadonlyArray<{
                        readonly name: string;
                        readonly segments: ReadonlyArray<number | null> | null;
                        readonly url: string;
                    } | null> | null;
                } | null> | null;
            } | null> | null;
        } | null> | null;
    } | null;
};
export type NewSearchQuery = {
    readonly response: NewSearchQueryResponse;
    readonly variables: NewSearchQueryVariables;
};



/*
query NewSearchQuery(
  $queryType: QueryType!
  $query: String!
  $page: Int
  $limit: Int
  $feedPreference: FeedPreference
  $languagePreference: LanguagePreference
  $contentPreference: ContentPreference
) {
  search(queryType: $queryType, languagePreference: $languagePreference, contentPreference: $contentPreference, feedPreference: $feedPreference, limit: $limit, page: $page, query: $query) {
    total
    plays {
      gameDate
      id
      gamePk
      mediaPlayback {
        id
        slug
        blurb
        date
        description
        title
        canAddToReel
        feeds {
          type
          duration
          image {
            altText
            templateUrl
            cuts {
              width
              src
              aspectRatio
            }
          }
          playbacks {
            name
            segments
            url
          }
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "contentPreference"
    } as any), v1 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "feedPreference"
    } as any), v2 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "languagePreference"
    } as any), v3 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "limit"
    } as any), v4 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "page"
    } as any), v5 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "query"
    } as any), v6 = ({
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "queryType"
    } as any), v7 = ({
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any), v8 = [
        ({
            "alias": null,
            "args": [
                {
                    "kind": "Variable",
                    "name": "contentPreference",
                    "variableName": "contentPreference"
                },
                {
                    "kind": "Variable",
                    "name": "feedPreference",
                    "variableName": "feedPreference"
                },
                {
                    "kind": "Variable",
                    "name": "languagePreference",
                    "variableName": "languagePreference"
                },
                {
                    "kind": "Variable",
                    "name": "limit",
                    "variableName": "limit"
                },
                {
                    "kind": "Variable",
                    "name": "page",
                    "variableName": "page"
                },
                {
                    "kind": "Variable",
                    "name": "query",
                    "variableName": "query"
                },
                {
                    "kind": "Variable",
                    "name": "queryType",
                    "variableName": "queryType"
                }
            ],
            "concreteType": "PagedClipDetails",
            "kind": "LinkedField",
            "name": "search",
            "plural": false,
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "total",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "concreteType": "ClipDetails",
                    "kind": "LinkedField",
                    "name": "plays",
                    "plural": true,
                    "selections": [
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "gameDate",
                            "storageKey": null
                        },
                        (v7 /*: any*/),
                        {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "gamePk",
                            "storageKey": null
                        },
                        {
                            "alias": null,
                            "args": null,
                            "concreteType": "MediaPlayback",
                            "kind": "LinkedField",
                            "name": "mediaPlayback",
                            "plural": true,
                            "selections": [
                                (v7 /*: any*/),
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "slug",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "blurb",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "date",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "description",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "title",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "canAddToReel",
                                    "storageKey": null
                                },
                                {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Feed",
                                    "kind": "LinkedField",
                                    "name": "feeds",
                                    "plural": true,
                                    "selections": [
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "type",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "duration",
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Image",
                                            "kind": "LinkedField",
                                            "name": "image",
                                            "plural": false,
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "altText",
                                                    "storageKey": null
                                                },
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "templateUrl",
                                                    "storageKey": null
                                                },
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "Cut",
                                                    "kind": "LinkedField",
                                                    "name": "cuts",
                                                    "plural": true,
                                                    "selections": [
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "kind": "ScalarField",
                                                            "name": "width",
                                                            "storageKey": null
                                                        },
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "kind": "ScalarField",
                                                            "name": "src",
                                                            "storageKey": null
                                                        },
                                                        {
                                                            "alias": null,
                                                            "args": null,
                                                            "kind": "ScalarField",
                                                            "name": "aspectRatio",
                                                            "storageKey": null
                                                        }
                                                    ],
                                                    "storageKey": null
                                                }
                                            ],
                                            "storageKey": null
                                        },
                                        {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Playback",
                                            "kind": "LinkedField",
                                            "name": "playbacks",
                                            "plural": true,
                                            "selections": [
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "name",
                                                    "storageKey": null
                                                },
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "segments",
                                                    "storageKey": null
                                                },
                                                {
                                                    "alias": null,
                                                    "args": null,
                                                    "kind": "ScalarField",
                                                    "name": "url",
                                                    "storageKey": null
                                                }
                                            ],
                                            "storageKey": null
                                        }
                                    ],
                                    "storageKey": null
                                }
                            ],
                            "storageKey": null
                        }
                    ],
                    "storageKey": null
                }
            ],
            "storageKey": null
        } as any)
    ];
    return {
        "fragment": {
            "argumentDefinitions": [
                (v0 /*: any*/),
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v3 /*: any*/),
                (v4 /*: any*/),
                (v5 /*: any*/),
                (v6 /*: any*/)
            ],
            "kind": "Fragment",
            "metadata": null,
            "name": "NewSearchQuery",
            "selections": (v8 /*: any*/),
            "type": "Query",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [
                (v6 /*: any*/),
                (v5 /*: any*/),
                (v4 /*: any*/),
                (v3 /*: any*/),
                (v1 /*: any*/),
                (v2 /*: any*/),
                (v0 /*: any*/)
            ],
            "kind": "Operation",
            "name": "NewSearchQuery",
            "selections": (v8 /*: any*/)
        },
        "params": {
            "cacheID": "76bfb60fbbc9f9136c675041d4485574",
            "id": null,
            "metadata": {},
            "name": "NewSearchQuery",
            "operationKind": "query",
            "text": "query NewSearchQuery(\n  $queryType: QueryType!\n  $query: String!\n  $page: Int\n  $limit: Int\n  $feedPreference: FeedPreference\n  $languagePreference: LanguagePreference\n  $contentPreference: ContentPreference\n) {\n  search(queryType: $queryType, languagePreference: $languagePreference, contentPreference: $contentPreference, feedPreference: $feedPreference, limit: $limit, page: $page, query: $query) {\n    total\n    plays {\n      gameDate\n      id\n      gamePk\n      mediaPlayback {\n        id\n        slug\n        blurb\n        date\n        description\n        title\n        canAddToReel\n        feeds {\n          type\n          duration\n          image {\n            altText\n            templateUrl\n            cuts {\n              width\n              src\n              aspectRatio\n            }\n          }\n          playbacks {\n            name\n            segments\n            url\n          }\n        }\n      }\n    }\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '97eea6be699182070da31c9fc6eb179c';
export default node;
