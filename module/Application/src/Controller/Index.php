<?php
namespace Application\Controller;

use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Index extends AbstractActionController
{
    public function __construct(
        UserFactory\User\BuildFromCookies $buildFromCookiesFactory
    ) {
        $this->buildFromCookiesFactory = $buildFromCookiesFactory;
    }

    public function indexAction()
    {
        $this->buildFromCookiesFactory->buildFromCookies();

        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
