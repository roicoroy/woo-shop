

export namespace BlogActions {
    export class GetPosts {
        static readonly type = '[BlogActions] Get Posts';
        constructor(public categoryId?: string | number) { }
    }
    export class GetPostById {
        static readonly type = '[BlogActions] Get Post By Id';
        constructor(public id: string | number) { }
    }
    export class ClearPostFromState {
        static readonly type = '[BlogActions] Get Clear Post from State';
    }
}
