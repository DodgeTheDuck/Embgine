
abstract class IState {

    abstract Init(): void;
    abstract Logic(): void;
    abstract Draw(): void;
    abstract Destroy(): void;

}