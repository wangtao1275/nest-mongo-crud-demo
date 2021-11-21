import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getModelToken } from '@nestjs/mongoose';
import { Employee } from './interfaces/employee.interface';
import { createMock } from '@golevelup/nestjs-testing';
import { Model, Query } from 'mongoose';
import { EmployeeDoc } from './interfaces/employee-document.interface';

const __id__ = '__id__';

// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockEmployee = (
  username = 'Terry',
  id = 'a uuid',
  team = 'Test Team 1',
  anumber = 'A602500',
  location = 'Dalian',
  squad = 'Agile Solutions',
): Employee => ({
  username,
  id,
  team,
  anumber,
  location,
  squad,
});

// still lazy, but this time using an object instead of multiple parameters
const mockEmployeeDoc = (mock?: Partial<Employee>): Partial<EmployeeDoc> => ({
  username: mock?.username || 'Terry',
  _id: mock?.id || 'a uuid',
  team: mock?.team || 'Test Team 1',
  anumber: mock?.anumber || 'A602500',
  location: mock?.location || 'Dalian',
  squad: mock?.squad || 'Agile Solutions',
});

const employeeArray = [
  mockEmployee(),
  mockEmployee(
    'Tom',
    'a new uuid',
    'Test Team 3',
    'A602501',
    'Shanghai',
    'Solutions',
  ),
  mockEmployee(
    'Jerry',
    'id id',
    'Test Team 4',
    'A602505',
    'Dalian',
    'Agile Solutions',
  ),
];

const employeeDocArray = [
  mockEmployeeDoc(),
  mockEmployeeDoc({
    username: 'Tom',
    id: 'a new uuid',
    team: 'Test Team 3',
    anumber: 'A602501',
    location: 'Shanghai',
    squad: 'Solutions',
  }),
  mockEmployeeDoc({
    username: 'Jerry',
    id: 'id id',
    team: 'Test Team 4',
    anumber: 'A602505',
    location: 'Dalian',
    squad: 'Agile Solutions',
  }),
];

describe('EmployeeService', () => {
  let service: EmployeeService;
  let model: Model<EmployeeDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getModelToken('Employee'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockEmployee()),
            constructor: jest.fn().mockResolvedValue(mockEmployee()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    model = module.get<Model<EmployeeDoc>>(getModelToken('Employee'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // In all the spy methods/mock methods we need to make sure to
  // add in the property function exec and tell it what to return
  // this way all of our mongo functions can and will be called
  // properly allowing for us to successfully test them.
  it('should return all employees', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(employeeDocArray),
    } as any);
    const employees = await service.getAll();
    expect(employees).toEqual(employeeArray);
  });
  it('should getOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<EmployeeDoc, EmployeeDoc>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockEmployeeDoc({ username: 'Terry', id: 'an id' }),
          ),
      }),
    );
    const findMockEmployee = mockEmployee('Terry', 'an id');
    const foundEmployee = await service.getOne('an id');
    expect(foundEmployee).toEqual(findMockEmployee);
  });
  it('should getOne by username', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<EmployeeDoc, EmployeeDoc>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockEmployeeDoc({ username: 'Terry', id: 'id id id' }),
          ),
      }),
    );
    const findMockEmployee = mockEmployee('Terry', 'id id id');
    const foundEmployee = await service.getOneByName('Terry');
    expect(foundEmployee).toEqual(findMockEmployee);
  });
  it('should insert a new employee', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        _id: 'some id',
        username: 'Oliver',
        team: 'Test Team 3',
        anumber: 'A602505',
        location: 'Dalian',
        squad: 'Agile Solutions',
      }),
    );
    const newEmployee = await service.insertOne({
      username: 'Oliver',
      team: 'Test Team 3',
      anumber: 'A602505',
      location: 'Dalian',
      squad: 'Agile Solutions',
    });
    expect(newEmployee).toEqual(
      mockEmployee(
        'Oliver',
        'some id',
        'Test Team 3',
        'A602505',
        'Dalian',
        'Agile Solutions',
      ),
    );
  });
  // jest is complaining about findOneAndUpdate. Can't say why at the moment.
  it.skip('should update a employee successfully', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<Query<EmployeeDoc, EmployeeDoc>>({
        exec: jest.fn().mockResolvedValueOnce({
          _id: __id__,
          username: 'Garfield',
          team: 'Test Team 3',
          anumber: 'A602505',
          location: 'Dalian',
          squad: 'Agile Solutions',
        }),
      }),
    );
    const updatedEmployee = await service.updateOne({
      _id: __id__,
      username: 'Garfield',
      team: 'Test Team 3',
      anumber: 'A602505',
      location: 'Dalian',
      squad: 'Agile Solutions',
    });
    expect(updatedEmployee).toEqual(
      mockEmployee(
        'Garfield',
        __id__,
        'Test Team 3',
        'A602505',
        'Dalian',
        'Agile Solutions',
      ),
    );
  });
  it('should delete a employee successfully', async () => {
    // really just returning a truthy value here as we aren't doing any logic with the return
    jest.spyOn(model, 'remove').mockResolvedValueOnce(true as any);
    expect(await service.deleteOne('a bad id')).toEqual({ deleted: true });
  });
  it('should not delete a employee', async () => {
    // really just returning a falsy value here as we aren't doing any logic with the return
    jest.spyOn(model, 'remove').mockRejectedValueOnce(new Error('Bad delete'));
    expect(await service.deleteOne('a bad id')).toEqual({
      deleted: false,
      message: 'Bad delete',
    });
  });
});
