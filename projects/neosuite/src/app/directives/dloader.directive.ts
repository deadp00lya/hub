import { Directive, ViewContainerRef, ComponentFactoryResolver, OnInit, OnDestroy, Renderer2, Input, AfterViewInit } from '@angular/core';
import { RemoteModuleLoaderService } from '../services/remote-module-loader.service';

@Directive( {
    selector: '[DCLoader]',
    exportAs: 'dloaderOut'
} )

export class DCLoaderDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input( "DCLoader" ) component: any;
    loadedFlag:boolean=false;

    ngOnDestroy(): void {
    }
    
    ngOnInit(): void {
    }

    constructor( private dynamicComponentLoader: RemoteModuleLoaderService, private renderer: Renderer2, public viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver ) {
    }
    loadComponent() {
        this.dynamicComponentLoader
            .getComponentFactory( this.component.widgetPath )
            .subscribe( componentFactory => {
                const ref = (<any>this.viewContainerRef.createComponent( componentFactory ));
                ref.instance.widgetDetail=this.component;
                ref.changeDetectorRef.detectChanges();
             
            }, error => {
                console.warn( error );
            } );
    }

    ngAfterViewInit(): void {
        this.loadComponent();
    }
}

