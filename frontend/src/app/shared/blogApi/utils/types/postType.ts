export interface WPost {
    id: number;
    date: string;
    date_gmt: string;
    guid: GuidOrTitle;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: GuidOrTitle;
    content: ContentOrExcerpt;
    excerpt: ContentOrExcerpt;
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    meta: Meta;
    categories?: (number)[] | null;
    tags?: (null)[] | null;
    _links: any;
}
export interface GuidOrTitle {
    rendered: string;
}
export interface ContentOrExcerpt {
    rendered: string;
    protected: boolean;
}
export interface Meta {
    footnotes: string;
}
export interface CuriesEntity {
    name: string;
    href: string;
    templated: boolean;
}
