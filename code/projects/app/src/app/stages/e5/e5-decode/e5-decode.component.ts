import { Component, signal } from "@angular/core";
import { ImageDisplayComponent } from "../../../shared/image-display/image-display.component";
import { ImageUploadComponent } from "../../../shared/image-upload/image-upload.component";
import { asyncComputed } from "../../../util/async-computed";
import { debouncedSignal } from "../../../util/debounced-signal";
import { PngMetaService } from "../e5-services/png-meta.service";

@Component({
  selector: "app-e5-decode",
  imports: [ImageDisplayComponent, ImageUploadComponent],
  templateUrl: "./e5-decode.component.html",
  styleUrl: "./e5-decode.component.css",
})
export class E5DecodeComponent {
  constructor(private readonly pngMetaService: PngMetaService) {}

  protected readonly keyContent = signal("");
  private readonly debouncedKey = debouncedSignal(this.keyContent, 300);

  protected readonly image = signal<ImageData | undefined>(undefined);
  protected readonly file = signal<File | undefined>(undefined);

  protected onKeyChange(event: Event): void {
    const key = (event.target as HTMLInputElement).value;
    this.keyContent.set(key);
  }

  protected readonly textContent = asyncComputed<string>("", async () => {
    const file = this.file();
    if (!file) return "";
    return (await this.pngMetaService.decode(file, this.debouncedKey())) ?? "";
  });
}
