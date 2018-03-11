
abstract class IState {

    abstract Init(): void;
    abstract Logic(): void;
    abstract PreDraw(): void;
    abstract Draw(): void;
    abstract Destroy(): void;

}