import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeDTO } from './employee.dto';
import { EmployeeService } from './employee.service';
import { Employee } from './interfaces/employee.interface';

const testEmployee1 = 'Test Employee 1';
const testTeam1 = 'Test Team 1';

describe('Employee Controller', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                username: testEmployee1,
                team: testTeam1,
                anumber: 'A602500',
                location: 'Dalian',
                squad: 'Agile Solutions',
              },
              {
                username: 'Test Employee 2',
                team: 'Test team 2',
                anumber: 'A602501',
                location: 'Shanghai',
                squad: 'Agile Solutions',
              },
              {
                username: 'Test Employee 3',
                team: 'Test team 3',
                anumber: 'A602502',
                location: 'Dalian',
                squad: 'Agile Solutions',
              },
            ]),
            getOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                username: testEmployee1,
                team: testTeam1,
                anumber: 'A602500',
                location: 'Dalian',
                squad: 'Agile Solutions',
                _id: id,
              }),
            ),
            getOneByName: jest.fn().mockImplementation((username: string) =>
              Promise.resolve({
                username,
                team: testTeam1,
                anumber: 'A602500',
                location: 'Dalian',
                squad: 'Agile Solutions',
              }),
            ),
            insertOne: jest
              .fn()
              .mockImplementation((employee: EmployeeDTO) =>
                Promise.resolve({ _id: 'a uuid', ...employee }),
              ),
            updateOne: jest
              .fn()
              .mockImplementation((employee: EmployeeDTO) =>
                Promise.resolve({ _id: 'a uuid', ...employee }),
              ),
            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEmployees', () => {
    it('should get an array of employees', () => {
      expect(controller.getEmployees()).resolves.toEqual([
        {
          username: testEmployee1,
          team: testTeam1,
          anumber: 'A602500',
          location: 'Dalian',
          squad: 'Agile Solutions',
        },
        {
          username: 'Test Employee 2',
          team: 'Test team 2',
          anumber: 'A602501',
          location: 'Shanghai',
          squad: 'Agile Solutions',
        },
        {
          username: 'Test Employee 3',
          team: 'Test team 3',
          anumber: 'A602502',
          location: 'Dalian',
          squad: 'Agile Solutions',
        },
      ]);
    });
  });
  describe('getById', () => {
    it('should get a single employee', () => {
      expect(controller.getById('a strange id')).resolves.toEqual({
        username: testEmployee1,
        team: testTeam1,
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
        _id: 'a strange id',
      });
      expect(controller.getById('a different id')).resolves.toEqual({
        username: testEmployee1,
        team: testTeam1,
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
        _id: 'a different id',
      });
    });
  });
  describe('getByName', () => {
    it('should get a employee back', async () => {
      await expect(controller.getByName('Terry')).resolves.toEqual({
        username: 'Terry',
        team: testTeam1,
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
      });
      // using the really cool @golevelup/nestjs-testing module's utility function here
      // otherwise we need to pass `as any` or we need to mock all 54+ attributes of Document
      const mock = createMock<Employee>({
        username: 'Tom',
        team: 'Test Team 10',
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
      });
      const getByNameSpy = jest
        .spyOn(service, 'getOneByName')
        .mockResolvedValueOnce(mock);
      const getResponse = await controller.getByName('Tom');
      expect(getResponse).toEqual(mock);
      expect(getByNameSpy).toBeCalledWith('Tom');
    });
  });
  describe('newEmployee', () => {
    it('should create a new employee', () => {
      const newEmployeeDTO: EmployeeDTO = {
        username: 'New Employee 1',
        team: 'New Team 1',
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
      };
      expect(controller.newEmployee(newEmployeeDTO)).resolves.toEqual({
        _id: 'a uuid',
        ...newEmployeeDTO,
      });
    });
  });
  describe('updateEmployee', () => {
    it('should update a new employee', () => {
      const newEmployeeDTO: EmployeeDTO = {
        username: 'New Employee 1',
        team: 'New Team 1',
        anumber: 'A602500',
        location: 'Dalian',
        squad: 'Agile Solutions',
      };
      expect(controller.updateEmployee(newEmployeeDTO)).resolves.toEqual({
        _id: 'a uuid',
        ...newEmployeeDTO,
      });
    });
  });
  describe('deleteEmployee', () => {
    it('should return that it deleted a employee', () => {
      expect(controller.deleteEmployee('a uuid that exists')).resolves.toEqual({
        deleted: true,
      });
    });
    it('should return that it did not delete a employee', () => {
      const deleteSpy = jest
        .spyOn(service, 'deleteOne')
        .mockResolvedValueOnce({ deleted: false });
      expect(
        controller.deleteEmployee('a uuid that does not exist'),
      ).resolves.toEqual({ deleted: false });
      expect(deleteSpy).toBeCalledWith('a uuid that does not exist');
    });
  });
});
