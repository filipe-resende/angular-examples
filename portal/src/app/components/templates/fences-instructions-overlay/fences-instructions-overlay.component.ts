import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export interface FenceInstruction {
  title: string;
  correctImgSrc: string;
  incorrectImgSrc: string;
}

export interface FencesInstructionsDialogComponentData {
  isError: boolean;
}

@Component({
  selector: 'app-fences-instructions-overlay',
  templateUrl: './fences-instructions-overlay.component.html',
  styleUrls: ['./fences-instructions-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FencesInstructionsOverlayComponent implements OnInit, OnDestroy {
  public instructions: FenceInstruction[];

  public subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<FencesInstructionsOverlayComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: FencesInstructionsDialogComponentData
  ) {}

  public ngOnInit(): void {
    this.setupInstructions();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public close(): void {
    this.dialogRef.close();
  }

  private setupInstructions() {
    const translateSub: Subscription = this.translateService
      .get('FENCES.INSTRUCTIONS_OVERLAY')
      .subscribe(({ DO_NOT_CROSS_LINES, NAME_ALREADY_EXISTS }) => {
        this.instructions = [
          {
            title: `${DO_NOT_CROSS_LINES}`,
            correctImgSrc:
              '../../../../assets/images/instructions/not-crossed.png',
            incorrectImgSrc:
              '../../../../assets/images/instructions/crossed.png'
          },
          {
            title: `${NAME_ALREADY_EXISTS}`,
            correctImgSrc: '',
            incorrectImgSrc: ''
          }
        ];
      });

    this.subscriptions.push(translateSub);
  }
}
