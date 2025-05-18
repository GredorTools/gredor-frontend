export interface Context {
  entity: Entity;
  period: Period;
}

export interface Entity {
  identifier: string;
}

type Period = PeriodInstant | PeriodInterval;

interface PeriodInstant {
  instant: string;
  type: "instant";
}

interface PeriodInterval {
  startDate: string;
  endDate: string;
  type: "interval";
}
