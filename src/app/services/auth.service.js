(function() {
    'use strict';
    
    angular
        .module('app')
        .service('authService', AuthService);
    
    function AuthService($window, $http, serverUrl) {
        this.getAuthToken = getAuthToken;
        this.getHeader = getJWTSection(0);
        this.getPayload = getJWTSection(1);
        
        this.isAuthenticated = isAuthenticated;
        
        //TODO: Add methods for account creation and login
        // this.createAccount = createAccount;
        // this.login = login;
        this.logout = logout;
        
        ///////////////
        
        var createAccountEndpoint = serverUrl + ''; //TODO: Determine account creation endpoint
        var loginEndpoint = serverUrl + ''; //TODO: Determine login endpoint
        
        function getAuthToken() {
            if($window.sessionStorage.authToken)
                return $window.sessionStorage.authToken;
            return null;
        }
        
        function isAuthenticated() {
            return getAuthToken() !== null;
        }
        
        function logout() {
            delete $window.sessionStorage.authToken;
        }
        
        function getJWTSection(section) {
            if(section !== 0 && section !== 1)
                throw 'Illegal JWT section!';
            
            return function() {
                var authToken = getAuthToken();
                
                if(!authToken)
                    return {};
                
                var base64_str = authToken.split('.')[section];
                return JSON.parse(url_base64_decode(base64_str));
            }
        }
        
        /**
         * John Papa's JWT Decoder...
         * https://github.com/johnpapa/ng-demos/blob/master/ng-jwt/src/client/app/login/login.js
         */
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
        
        // Private functions
        this._getJWTSection = getJWTSection;
        this._url_base64_decode = url_base64_decode;
    }
})();
