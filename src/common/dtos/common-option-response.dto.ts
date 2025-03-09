export class CommonOptionResponseDto {
  id: string;
  name: string;
  description?: string;

  constructor(id: string, name: string, description: string | null) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
