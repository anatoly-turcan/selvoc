export type BuildTimestampsParams = {
  createdAt: Date;
  updatedAt: Date;
};

export class Timestamps {
  public createdAt: Date;

  public updatedAt: Date;

  constructor(params: BuildTimestampsParams) {
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  public static now(): Timestamps {
    const now = new Date();

    return new Timestamps({ createdAt: now, updatedAt: now });
  }

  public update(data: Partial<BuildTimestampsParams>): this {
    this.createdAt = data.createdAt ?? this.createdAt;
    this.updatedAt = data.updatedAt ?? this.updatedAt;

    return this;
  }

  public updated(date: Date = new Date()): this {
    return this.update({ updatedAt: date });
  }
}
