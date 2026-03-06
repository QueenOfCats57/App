export interface StatisticsData {
  totalCourses: number;
  averageRating: number;
  totalStudents: number;
  lastUpdated: Date;
}

export interface StatisticsChange {
  property: string;
  oldValue: any;
  newValue: any;
  changeTime: Date;
}