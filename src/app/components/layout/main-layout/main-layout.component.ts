import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  protected currentSection: number = 0;
  private isScrolling: boolean = false;

  @ViewChildren('section') private sections!: QueryList<ElementRef<HTMLElement>>;

  @HostListener('wheel', ['$event'])
  onScroll(event: any) {
    if(this.isScrolling) return;
    // this.sections.toArray()[this.currentSection].nativeElement.classList.remove('active');
    if(event.deltaY > 0) {
      this.currentSection++;
      this.currentSection = this.currentSection % this.sections.toArray().length;
    } else {
      this.currentSection--;
      this.currentSection = this.currentSection < 0 ? this.sections.toArray().length - 1 : this.currentSection;
    }
    this.scrollToElement(this.sections.toArray()[this.currentSection].nativeElement);
  }

  ngOnInit(): void {
    const interval = setInterval(() => {
      if(this.sections && this.sections?.length) {
        clearInterval(interval);
        this.sections.toArray()[0].nativeElement.classList.add('active');
      }
    }, 100);
  }

  protected scrollToElement(element: HTMLElement | any): void {
    this.isScrolling = true;
    element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

    const interval = setInterval(() => {
      if(element.getBoundingClientRect().top === 0) {
        clearInterval(interval);
        element.classList.add('active');
        this.isScrolling = false;
      }
    }, 100);
  }

  protected selectElem(sectionNumber: number): void {
    if(this.currentSection === sectionNumber) return;

    this.currentSection = sectionNumber;
    this.scrollToElement(this.sections.toArray()[this.currentSection].nativeElement);
  }
}
