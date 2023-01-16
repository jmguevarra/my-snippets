const routes: Routes = [
  { path: 'modal', component: ModalComponent, canActivate: [CanActivateModalGuard] }
];
