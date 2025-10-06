import AsyncTasksQueue from '#src/AsyncTasksQueue.js';
import { describe, it, expect } from 'vitest';

describe('AsyncQueue should work', () => {
    it('Prove that paralell promises resolve in order of timeout, not in order of enqueue', async () => {
        let result = '';
        await Promise.all([
            (async () => {
                result = await taskTimeout1000();
            })(),
            (async () => {
                result = await taskTimeout500();
            })(),
            (async () => {
                result = await taskTimeout0();
            })()
        ]);
        expect(result).toBe('taskTimeout1000');
    }, 2000);

    it('Should queue tasks and return correct result', async () => {
        const queue = new AsyncTasksQueue();
        let result = '';
        await Promise.all([
            queue.enqueue(async () => { result = await taskTimeout1000() }),
            queue.enqueue(async () => { result = await taskTimeout500() }),
            queue.enqueue(async () => { result = await taskTimeout0() })
        ]);
        expect(result).toBe('taskTimeout0');
    }, 2000);

    it('Should queue a lot of tasks tasks and return correct result', async () => {
        const queue = new AsyncTasksQueue();
        let result = '';

        const tasks = [
            async () => { result = await taskTimeout0() },
            async () => { result = await taskTimeout100() },
            async () => { result = await taskTimeout200() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout500() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout500() },
            async () => { result = await taskTimeout600() },
            async () => { result = await taskTimeout700() },
            async () => { result = await taskTimeout800() },
            async () => { result = await taskTimeout0() },
            async () => { result = await taskTimeout900() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout300() },
            async () => { result = await taskTimeout400() },
            async () => { result = await taskTimeout900() },
        ];

        await Promise.all(tasks.map((task) => queue.enqueue(task)));
        expect(result).toBe('taskTimeout900');
    }, 20000);

    it('Should have correct queue length and processing state', async () => {
        const queue = new AsyncTasksQueue();
        const tasks = [
            taskTimeout0,
            taskTimeout100,
            taskTimeout200,
            taskTimeout1000,
            taskTimeout500,
            taskTimeout1000,
            taskTimeout500,
            taskTimeout600,
            taskTimeout700,
            taskTimeout800,
            taskTimeout0,
            taskTimeout900,
            taskTimeout1000,
            taskTimeout1000,
            taskTimeout300,
            taskTimeout400,
            taskTimeout900,
        ];

        const processingTasksPromise = Promise.all(tasks.map((task) => queue.enqueue(task)));
        const queueLengthState = Reflect.get(queue, 'queue').length;
        expect(queueLengthState).toBe(tasks.length - 1);
        const processingState = Reflect.get(queue, 'processing');
        expect(processingState).toBe(true);
        await processingTasksPromise;
        const processing = Reflect.get(queue, 'processing');
        expect(processing).toBe(false);
        const queueLength = Reflect.get(queue, 'queue').length;
        expect(queueLength).toBe(0);

    }, 20000);

    it('Queued tasks should take sum of all tasks time', async () => {
        const queue = new AsyncTasksQueue();
        const tasksFor5Sec500Milisec = [
            taskTimeout0,
            taskTimeout100,
            taskTimeout200,
            taskTimeout0,
            taskTimeout300,
            taskTimeout400,
            taskTimeout500,
            taskTimeout600,
            taskTimeout0,
            taskTimeout700,
            taskTimeout800,
            taskTimeout900,
            taskTimeout0,
            taskTimeout1000,
            taskTimeout0,
        ];
        const startDate = new Date().getTime();
        const processingTasksPromise = Promise.all(tasksFor5Sec500Milisec.map((task) => queue.enqueue(task)));
        await processingTasksPromise;
        const endDate = new Date().getTime();
        const shouldBe5Seconds = (endDate - startDate) / 1000;
        expect(shouldBe5Seconds).toBeGreaterThan(5.49);
        expect(shouldBe5Seconds).toBeLessThan(5.70);
    }, 6000);

    it('Should add to queue when queue is already processing', async () => {

        let result = 'initial';
        const queue = new AsyncTasksQueue();
        const tasks5Sec = [
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout1000() },
            async () => { result = await taskTimeout1000() },
        ];

        const processingTasksPromise = Promise.all(tasks5Sec.map((task) => queue.enqueue(task)));

        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(result).toBe('initial');
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(result).toBe('taskTimeout1000');

        const randomTasks = Promise.all([
            queue.enqueue(async () => { result = await taskTimeout500() }),
            queue.enqueue(async () => { result = await taskTimeout300() }),
            queue.enqueue(async () => { result = await taskTimeout400() }),
            queue.enqueue(async () => { result = await taskTimeout0() }),
            queue.enqueue(async () => { result = await taskTimeout0() }),
            queue.enqueue(taskTimeout0),
            queue.enqueue(async () => { result = await taskTimeout200() }),
        ]);

        expect(result).toBe('taskTimeout1000');
        await processingTasksPromise;
        await randomTasks;
        expect(result).toBe('taskTimeout200');

    }, 7000);
});


const taskTimeout1000 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout1000');
        }, 1000);
    });
};

const taskTimeout900 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout900');
        }, 900);
    });
};

const taskTimeout800 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout800');
        }, 800);
    });
};

const taskTimeout700 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout700');
        }, 700);
    });
};

const taskTimeout600 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout600');
        }, 600);
    });
};

const taskTimeout500 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout500');
        }, 500);
    });
};

const taskTimeout400 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout400');
        }, 400);
    });
};

const taskTimeout300 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout300');
        }, 300);
    });
};

const taskTimeout200 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout200');
        }, 200);
    });
};

const taskTimeout100 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout100');
        }, 100);
    });
};

const taskTimeout0 = async (): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('taskTimeout0');
        }, 0);
    });
};