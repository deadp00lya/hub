import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '@nw-workspace/common-services';
import { OAuthService } from 'angular-oauth2-oidc';
import { SecurityQuestionDTO } from '../../../models/SecurityQuestions';
import { UserDTO } from '../../../models/userDTO';
import { AuthService } from "../../../services/auth.service";

declare var $: any;

@Component( {
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']

} )
export class GeneralComponent implements OnInit {
    //instanceelModal: any;

    currentUser;
    selectedRole;
    mythis;
    //outlookDTO: OutlookDTO = new OutlookDTO();
    //instanceelModalOutlookModal: any;
    userDTO: UserDTO = new UserDTO();
    securityQuestionList: SecurityQuestionDTO[] = [];
    profileInfo: any = {};
    //widgetMenus: any;
    languages: any[] = [];
    widgetMenuView: any;
    file: any;
    file1: any;
    addFile: boolean = true;
    addFile1: boolean = true;
    fileName: string = "";
    fileName1: string = "";
    profileRegister: FormData = new FormData();
    userName: string;
    langCode: string;
    themes: any[] = []
    currentLocation: any;
    outlookFlag: boolean = false;
    isClientBgImageEnabled: boolean;
    view: string;
    widgetMenu: string
    constructor( private sessionService: SessionService, private authService: AuthService, private http: HttpClient, private oauthService: OAuthService ) {
        this.currentUser = this.sessionService.getCurrentUser();
    }

    @ViewChild( 'outlookModal' ) elModal: ElementRef;

    ngAfterViewInit() {
        // this.instanceelModal = new M.Modal( this.elModal.nativeElement, { dismissible: false } );

    }
    ngOnInit() {

        this.fetchProfileDetails();
        this.fetchLanguageList();
        this.widgetMenuView = ["List", "Grid"];
        this.userName = this.currentUser.username;
        this.currentLocation = window.location.origin;
        localStorage.setItem( 'profileUrl', JSON.stringify( this.currentLocation ) );
        this.getThemes();
    }

    loadImage( propertyValue, propertyName, imgId ) {

        return this.http
            .get( "neosuite/api/image?propertyValue=" + propertyValue + "&propertyName=" + propertyName, { responseType: 'blob' } )
            .subscribe( data => {

                let elem = <any>document.getElementById( imgId );

                if ( window.navigator.msSaveOrOpenBlob ) { // Checking if IE
                    let reader = new FileReader();
                    let dataURL = '';
                    reader.onload = function readerFile( e ) {
                        elem.src = reader.result;
                    };
                    reader.readAsDataURL( data );
                } else {
                    elem.src = ( window.URL ).createObjectURL( data );
                }

            } );
    }

    fetchProfileDetails() {

        return this.http.get<any>( "neosuite/api/fetchProfileDetails" )
            .subscribe( data => {

                this.profileInfo = data.payload.userProfileDetails;
                
                if ( this.profileInfo.userBackgroundImage != null && this.profileInfo.userBackgroundImage != '' ) {
                    this.addFile = false
                }
                this.isClientBgImageEnabled = data.payload.isClientBgImageEnabled;
               
               
               

                setTimeout( function() {
                    $( 'select' ).formSelect();
                }, 50 );
            } )
    }

    fetchLanguageList() {
        let appCode = "App10017"
        this.langCode = this.currentUser.additionalDetails.mdm.preferredLang;
        let clientCode = this.currentUser.additionalDetails.mdm.clientCode;
        return this.http.get<any>( "polyglot/api/tenants/"+clientCode+"/language/app/" + appCode ).subscribe(
            response => {

                if ( response == null || response.payload == null || response.payload.length == 0 ) {
                    this.languages = [{ "languageCode": "en", "languageName": "English" }];
                    this.languages.forEach(( value, key ) => {
                        this.userDTO.languageDTO = this.languages[key];
                        return;
                    } );
                }
                else {
                    this.languages = response.payload;
                    this.languages.forEach(( value, key ) => {

                        if ( value.languageCode === this.langCode ) {

                            this.userDTO.languageDTO = this.languages[key];
                            return;
                        }

                    } );
                }
                setTimeout( function() {
                    $( 'select' ).formSelect();
                }, 50 );

            } );
    }

    getUserImage( event ) {
        //        this.file = event.target.files[0];
        //        this.fileName = this.file.name;
        //        this.userDTO.userImage = this.fileName;
    }

    getBackgroundImage( event ) {

        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.userDTO.userBackgroundImage = this.fileName;
    }

    updateUserProfile() {
        this.setProfileFields();
        return this.http.post<any>( "neosuite/api/updateUserProfile", this.profileRegister )
            .subscribe( data => {
                //  this.sessionService.removeCurrentUser();
                this.userDTO = data.payload;
                let noRedirectToLogoutUrl = true
                this.oauthService.logOut( noRedirectToLogoutUrl )
                location.reload();
            } )
    }

    setProfileFields() {
        this.profileRegister = new FormData();
        if ( this.file == undefined ) {
            // this.profileRegister.append( 'userImage', new File( [""], "" ) );
        } else {
            //            this.profileRegister.append( 'userImage', this.file );
            //            this.userDTO.userImageFlag=true
        }

        if ( this.file == undefined ) {
            // this.profileRegister.append( 'userBackgroundImage', new File( [""], "" ) );
        } else {
            this.profileRegister.append( 'userBackgroundImage', this.file );
            this.userDTO.userBackgroundImageFlag = true
        }

        this.profileRegister.append( 'properties', new Blob( [JSON.stringify( {
            'firstName': this.userDTO.firstName,
            'lastName': this.userDTO.lastName,
            'preferredLang': this.userDTO.languageDTO != null ? this.userDTO.languageDTO.languageCode != null ? this.userDTO.languageDTO.languageCode : null : null,
            'timezoneDTO': this.userDTO.timezoneDTO,
            'userImageFlag': this.userDTO.userImageFlag,
            'userBackgroundImage': this.userDTO.userBackgroundImage,
            'userBackgroundImageFlag': this.userDTO.userBackgroundImageFlag,
        } )], {
                type: "application/json"
            } ) );

    }

    /*loginOutlookMS365() {
        this.outlookFlag = true;
        this.MicrosoftOutlookService.sendMicrosoftLoginPage();
        //this.fetchaccessTokenData();
    }*/
    // end 

    /*    // outlook access API save Access token link
        saveAccessTokenData() {
    
            if ( !this.isUndefinedOrNullOrEmpty( window.location.search ) ) {
                this.MicrosoftOutlookService.saveAccessTokenData();
                //this.outlookFlag = true;
            }
        }
    */
    isUndefinedOrNullOrEmpty( obj ) {
        if ( obj == undefined || obj == null || obj == "" ) {
            return true;
        }
        else {
            return false;
        }
    }

    closeOutlookModal() {

        //this.outlookFlag = false;
        $( "#outlookModal" ).modal( 'close' );
    }

    getThemes() {
        this.http.get<any>( "neosuite/api/getMyThemes" )
            .subscribe( data => {
                this.themes = data.payload;
            } );

    }

    setCurrentTheme( theme: string ) {

        let tempActiveTheme = theme;

        this.currentUser = this.sessionService.getCurrentUser();
        if ( this.currentUser != null && this.currentUser.additionalDetails.themeColor != theme ) {

            if ( theme.startsWith( '#', 0 ) ) {
                tempActiveTheme = "%23" + theme.substring( 1, theme.length )
            }
            return this.http
                .get<any>( "neosuite/api/setCurrentTheme?fileName=" + tempActiveTheme )
                .subscribe( data => {
                    //$( "<style/>" ).text( data ).appendTo( document.head )[0];
                    var link = document.createElement( 'link' );
                    link.type = 'text/css';
                    link.rel = 'stylesheet';

                    link.href = data.payload;

                    $( 'head' ).append( link );
                    //   this.currentUser.additionalDetails.themeColor = theme
                    //   this.sessionService.setCurrentUser( this.currentUser )

                } );
        }

    }

    filter( theme: string, type ) {

        if ( type == 'p' )
            return theme.split( "-" )[0]
        else
            return theme.split( "-" )[1]
    }

    /*    openOutlookModal() {
            //this.outlookFlag = $('#mySwitch').prop('checked');
            this.instanceelModal.open();
        }*/
}
