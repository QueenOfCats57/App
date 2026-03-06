import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  DoCheck,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  AfterContentChecked,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ContentChild,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsData, StatisticsChange } from '../../pages/course-statistics/statistics.model';

@Component({
  selector: 'app-course-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-statistics.html',
  styleUrls: ['./course-statistics.scss']
})
export class CourseStatisticsComponent implements 
  OnInit, 
  OnChanges, 
  DoCheck, 
  AfterViewInit, 
  AfterViewChecked, 
  AfterContentInit, 
  AfterContentChecked,
  OnDestroy {
  
  // Входные параметры
  @Input() totalCourses: number = 0;
  @Input() averageRating: number = 0;
  @Input() totalStudents: number = 0;
  @Input() refreshInterval: number = 5000; // Интервал обновления в мс
  
  // Выходные события
  @Output() statisticsChange = new EventEmitter<StatisticsChange>();
  @Output() lifecycleEvent = new EventEmitter<{hook: string, data: any}>();
  
  // ViewChild для доступа к DOM элементам
  @ViewChild('statsContainer') statsContainer!: ElementRef;
  @ViewChild('statValue') statValue!: ElementRef;
  
  // ContentChild для доступа к проецируемому контенту
  @ContentChild('statHeader') statHeader: any;
  @ContentChild('statFooter') statFooter: any;
  
  // Публичные свойства для шаблона
  previousValues: StatisticsData = {
    totalCourses: 0,
    averageRating: 0,
    totalStudents: 0,
    lastUpdated: new Date()
  };
  
  currentValues: StatisticsData = {
    totalCourses: 0,
    averageRating: 0,
    totalStudents: 0,
    lastUpdated: new Date()
  };
  
  changes: StatisticsChange[] = [];
  hookExecutionTimes: {[key: string]: number} = {};
  isInitialized: boolean = false;
  updateCounter: number = 0;
  private intervalId: any;
  
  // Для демонстрации DoCheck
  public oldTotalCourses: number = 0;
  public oldAverageRating: number = 0;
  public oldTotalStudents: number = 0;
  
  constructor(private cdr: ChangeDetectorRef) {
    console.log('🔧 Constructor: Компонент создан');
    this.logLifecycle('constructor', {
      totalCourses: this.totalCourses,
      averageRating: this.averageRating,
      totalStudents: this.totalStudents
    });
  }

  // 1. ngOnInit - вызывается один раз после установки входных свойств
  ngOnInit() {
    const startTime = performance.now();
    console.log('🚀 ngOnInit: Компонент инициализирован');
    
    // Инициализация данных
    this.currentValues = {
      totalCourses: this.totalCourses,
      averageRating: this.averageRating,
      totalStudents: this.totalStudents,
      lastUpdated: new Date()
    };
    
    this.previousValues = { ...this.currentValues };
    this.oldTotalCourses = this.totalCourses;
    this.oldAverageRating = this.averageRating;
    this.oldTotalStudents = this.totalStudents;
    
    // Запуск периодического обновления для демонстрации изменений
    this.startAutoUpdate();
    
    this.isInitialized = true;
    const endTime = performance.now();
    this.hookExecutionTimes['ngOnInit'] = endTime - startTime;
    
    this.logLifecycle('ngOnInit', {
      currentValues: this.currentValues,
      executionTime: this.hookExecutionTimes['ngOnInit']
    });
  }

  // 2. ngOnChanges - вызывается при изменении входных свойств (@Input)
  ngOnChanges(changes: SimpleChanges) {
    const startTime = performance.now();
    console.log('🔄 ngOnChanges: Изменение входных свойств', changes);
    
    // Анализируем каждое изменение
    Object.keys(changes).forEach(key => {
      const change = changes[key];
      const changeRecord: StatisticsChange = {
        property: key,
        oldValue: change.previousValue,
        newValue: change.currentValue,
        changeTime: new Date()
      };
      
      this.changes.unshift(changeRecord);
      this.statisticsChange.emit(changeRecord);
      
      console.log(`   Свойство "${key}": ${change.previousValue} -> ${change.currentValue}`);
      console.log(`   Первое изменение: ${change.firstChange}`);
    });
    
    // Обновляем текущие значения
    this.currentValues = {
      totalCourses: this.totalCourses,
      averageRating: this.averageRating,
      totalStudents: this.totalStudents,
      lastUpdated: new Date()
    };
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngOnChanges'] = endTime - startTime;
    
    this.logLifecycle('ngOnChanges', {
      changes: changes,
      executionTime: this.hookExecutionTimes['ngOnChanges']
    });
  }

  // 3. ngDoCheck - вызывается при каждой проверке изменений
  ngDoCheck() {
    const startTime = performance.now();
    
    // Ручная проверка изменений (для демонстрации)
    let hasChanges = false;
    
    if (this.oldTotalCourses !== this.totalCourses) {
      console.log('🔍 ngDoCheck: Обнаружено изменение totalCourses', {
        old: this.oldTotalCourses,
        new: this.totalCourses
      });
      this.oldTotalCourses = this.totalCourses;
      hasChanges = true;
    }
    
    if (this.oldAverageRating !== this.averageRating) {
      console.log('🔍 ngDoCheck: Обнаружено изменение averageRating', {
        old: this.oldAverageRating,
        new: this.averageRating
      });
      this.oldAverageRating = this.averageRating;
      hasChanges = true;
    }
    
    if (this.oldTotalStudents !== this.totalStudents) {
      console.log('🔍 ngDoCheck: Обнаружено изменение totalStudents', {
        old: this.oldTotalStudents,
        new: this.totalStudents
      });
      this.oldTotalStudents = this.totalStudents;
      hasChanges = true;
    }
    
    if (hasChanges) {
      this.updateCounter++;
      this.logLifecycle('ngDoCheck', {
        changesDetected: true,
        updateCounter: this.updateCounter
      });
    }
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngDoCheck'] = (this.hookExecutionTimes['ngDoCheck'] || 0) + (endTime - startTime);
  }

  // 4. ngAfterContentInit - вызывается после инициализации проецируемого контента
  ngAfterContentInit() {
    const startTime = performance.now();
    console.log('📦 ngAfterContentInit: Проецируемый контент инициализирован');
    
    console.log('   ContentChild statHeader:', this.statHeader ? '✅ Найден' : '❌ Не найден');
    console.log('   ContentChild statFooter:', this.statFooter ? '✅ Найден' : '❌ Не найден');
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngAfterContentInit'] = endTime - startTime;
    
    this.logLifecycle('ngAfterContentInit', {
      hasHeader: !!this.statHeader,
      hasFooter: !!this.statFooter,
      executionTime: this.hookExecutionTimes['ngAfterContentInit']
    });
  }

  // 5. ngAfterContentChecked - вызывается после каждой проверки проецируемого контента
  ngAfterContentChecked() {
    const startTime = performance.now();
    console.log('📋 ngAfterContentChecked: Проверка проецируемого контента завершена');
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngAfterContentChecked'] = (this.hookExecutionTimes['ngAfterContentChecked'] || 0) + (endTime - startTime);
    
    // Логируем только каждый 10-й вызов, чтобы не засорять консоль
    if (this.updateCounter % 10 === 0) {
      this.logLifecycle('ngAfterContentChecked', {
        counter: this.updateCounter,
        executionTime: endTime - startTime
      });
    }
  }

  // 6. ngAfterViewInit - вызывается после инициализации представления
  ngAfterViewInit() {
    const startTime = performance.now();
    console.log('👁️ ngAfterViewInit: Представление инициализировано');
    
    // Доступ к ViewChild элементам
    if (this.statsContainer) {
      console.log('   statsContainer найден:', this.statsContainer.nativeElement);
      // Добавляем анимацию
      this.statsContainer.nativeElement.style.animation = 'fadeIn 0.5s ease';
    }
    
    if (this.statValue) {
      console.log('   statValue найден:', this.statValue.nativeElement);
    }
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngAfterViewInit'] = endTime - startTime;
    
    this.logLifecycle('ngAfterViewInit', {
      hasContainer: !!this.statsContainer,
      hasValue: !!this.statValue,
      executionTime: this.hookExecutionTimes['ngAfterViewInit']
    });
  }

  // 7. ngAfterViewChecked - вызывается после каждой проверки представления
  ngAfterViewChecked() {
    const startTime = performance.now();
    
    // Обновляем стили при каждом изменении (демонстрация)
    if (this.statsContainer && this.isInitialized) {
      const elements = this.statsContainer.nativeElement.querySelectorAll('.stat-value');
      elements.forEach((el: HTMLElement) => {
        if (this.hasValueChanged(el.textContent || '')) {
          el.style.animation = 'pulse 0.3s ease';
          setTimeout(() => {
            el.style.animation = '';
          }, 300);
        }
      });
    }
    
    const endTime = performance.now();
    this.hookExecutionTimes['ngAfterViewChecked'] = (this.hookExecutionTimes['ngAfterViewChecked'] || 0) + (endTime - startTime);
  }

  // 8. ngOnDestroy - вызывается перед уничтожением компонента
  ngOnDestroy() {
    console.log('💀 ngOnDestroy: Компонент уничтожается');
    
    // Очищаем ресурсы
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('   Интервал автоматического обновления очищен');
    }
    
    // Логируем финальную статистику
    console.log('   Статистика хуков жизненного цикла:', this.hookExecutionTimes);
    console.log('   Всего обнаружено изменений:', this.updateCounter);
    console.log('   История изменений:', this.changes);
    
    this.logLifecycle('ngOnDestroy', {
      hookExecutionTimes: this.hookExecutionTimes,
      totalUpdates: this.updateCounter,
      totalChanges: this.changes.length
    });
  }

  // Вспомогательные методы
  private logLifecycle(hook: string, data: any) {
    this.lifecycleEvent.emit({ hook, data });
  }

  private hasValueChanged(currentValue: string): boolean {
    // Простая проверка для демонстрации
    return Math.random() > 0.7; // Имитация изменений в 30% случаев
  }

  private startAutoUpdate() {
    // Имитация периодических обновлений для демонстрации жизненного цикла
    this.intervalId = setInterval(() => {
      // Случайным образом изменяем значения
      if (Math.random() > 0.5) {
        this.totalCourses += Math.floor(Math.random() * 3) - 1; // -1, 0, или +1
      }
      
      if (Math.random() > 0.7) {
        this.averageRating += (Math.random() * 0.2) - 0.1; // -0.1 до +0.1
        this.averageRating = Math.max(0, Math.min(5, this.averageRating));
      }
      
      if (Math.random() > 0.6) {
        this.totalStudents += Math.floor(Math.random() * 10) - 3; // -3 до +6
        this.totalStudents = Math.max(0, this.totalStudents);
      }
      
      console.log('⏰ Автоматическое обновление данных:', {
        totalCourses: this.totalCourses,
        averageRating: this.averageRating,
        totalStudents: this.totalStudents
      });
      
    }, this.refreshInterval);
  }

  // Публичные методы для взаимодействия
  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  getExecutionTime(hook: string): string {
    return this.hookExecutionTimes[hook]?.toFixed(2) + 'ms' || 'N/A';
  }

  getTotalExecutionTime(): string {
    const total = Object.values(this.hookExecutionTimes).reduce((sum, time) => sum + time, 0);
    return total.toFixed(2) + 'ms';
  }

  forceChanges() {
    // Принудительное изменение для демонстрации ngOnChanges
    // @ts-ignore
    this.totalCourses += 5;
    this.totalStudents += 20;
    this.averageRating += 0.1;
  }
}