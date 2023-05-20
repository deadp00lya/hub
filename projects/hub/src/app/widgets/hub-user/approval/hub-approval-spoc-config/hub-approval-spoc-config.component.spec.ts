import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HubApprovalSpocConfigComponent } from "src/app/components/hub/widgets/hub-user/approval/hub-approval-spoc-config/hub-approval-spoc-config.component";


describe( 'HubApprovalSpocConfigComponent', () => {
    let component: HubApprovalSpocConfigComponent;
    let fixture: ComponentFixture<HubApprovalSpocConfigComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule( {
            declarations: [HubApprovalSpocConfigComponent]
        } )
            .compileComponents();
    } ) );

    beforeEach(() => {
        fixture = TestBed.createComponent( HubApprovalSpocConfigComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
